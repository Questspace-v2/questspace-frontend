'use client';

import Image from 'next/image';
import {uid} from '@/lib/utils/utils';
import { Button, CountdownProps, Form, Input, message, Statistic, Tooltip } from 'antd';
import {
    IHint,
    IHintRequest,
    ITask,
    ITaskAnswer,
    ITaskAnswerResponse,
    ITaskGroup,
    ITaskGroupDuration,
} from '@/app/types/quest-interfaces';
import {SendOutlined} from '@ant-design/icons';
import FormItem from 'antd/lib/form/FormItem';
import {getTaskExtra, TasksMode} from '@/components/Tasks/Task/Task.helpers';
import {answerTaskPlayMode, takeHintPlayMode} from '@/app/api/api';
import {useSession} from 'next-auth/react';
import { useCallback, useEffect, useState, useRef } from 'react';
import {useRouter} from 'next/navigation';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import classNames from 'classnames';
import {useTasksContext} from '@/components/Tasks/ContextProvider/ContextProvider';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/scss/lightgallery.scss';
import 'lightgallery/scss/lg-zoom.scss';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import { LightGallery as LightGalleryType } from 'lightgallery/lightgallery';


const { Countdown } = Statistic;
const enum SendButtonStates {
    BASIC = 'basic',
    LOADING = 'loading',
    DISABLED = 'disabledBasic',
    TIMER = 'timer'
}

const enum InputStates {
    BASIC = 'basic',
    ERROR = 'error',
    ACCEPTED = 'accepted'
}

interface TaskProps {
    mode: TasksMode,
    props: ITask,
    questId: string,
    taskGroupProps: Pick<ITaskGroup, 'id' | 'pub_time' | 'name'> & ITaskGroupDuration,
    isExpired?: boolean,
}

export default function Task({mode, props, questId, taskGroupProps, isExpired}: TaskProps) {
    const {
        name,
        question,
        media_links: mediaLinks,
        correct_answers: correctAnswers,
        id: taskId,
        answer: teamAnswer,
        score,
        reward,
    } = props;
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openConfirmIndex, setOpenConfirmIndex] = useState<0 | 1 | 2 | null>(null);
    const [takenHints, setTakenHints] = useState([false, false, false]);
    const editMode = mode === TasksMode.EDIT;
    const hintsFull = editMode ? props.hints_full : props.hints as unknown as IHint[];
    const lightGalleryRef = useRef<LightGalleryType | null>(null);

    const transformHints = () => hintsFull.map(hint => ({
        ...hint,
        taken: hint?.taken || false,
    }));

    const objectHints = hintsFull?.length && hintsFull[0].text ? transformHints() : hintsFull;

    const calcCurrentScore = useCallback(() => objectHints.reduce((acc, curr) => {
        if (curr?.taken) {
            return acc - (curr?.penalty?.score ?? (curr?.penalty?.percent ?? 0) * 0.01 * reward ?? 0)
        }

        return acc
    }, reward), [objectHints, reward])

    const severalAnswers = editMode ? correctAnswers.length > 1 : false;
    const [form] = Form.useForm();
    const {data: session} = useSession();
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();

    const { updater: setContextData} = useTasksContext()!;
    const currentTaskGroupId = taskGroupProps.id;

    const [sendButtonState, setSendButtonState] = useState<SendButtonStates>(teamAnswer ? SendButtonStates.DISABLED : SendButtonStates.BASIC);
    const [inputState, setInputState] = useState<InputStates>(teamAnswer ? InputStates.ACCEPTED : InputStates.BASIC);
    const [sendButtonContent, setSendButtonContent] = useState<React.JSX.Element | null>(<SendOutlined/>);
    const [inputValidationStatus, setInputValidationStatus] = useState<'success' | 'error' | ''>(teamAnswer ? 'success' : '');

    const [accepted, setAccepted] = useState(Boolean(score && score > 0));
    const [scoreText, setScoreText] = useState([reward, ...objectHints.map((hint) =>
        hint.taken ? ` - ${(hint?.penalty?.percent ?? 0) * 0.01 * reward || hint?.penalty?.score}` : ''
    )].join(' '));
    const [currentScore, setCurrentScore] = useState(calcCurrentScore())

    const onFinish: CountdownProps['onFinish'] = () => {
        setSendButtonContent(<SendOutlined/>);
        setSendButtonState(SendButtonStates.BASIC);
    };

    useEffect(() => {
        setCurrentScore(calcCurrentScore())
    }, [calcCurrentScore, objectHints]);

    const success = () => {
        // eslint-disable-next-line no-void
        void messageApi.open({
            type: 'success',
            content: 'Принято!',
        });
    };

    const handleTakeHint = async (index: number) => {
        if (editMode) {
            setTakenHints([...takenHints.slice(0, index), true, ...takenHints.slice(index + 1)]);
            setOpenConfirm(false);
            setOpenConfirmIndex(null);
            return;
        }

        const data: IHintRequest = {
            index,
            task_id: taskId!
        };

        setOpenConfirm(false);
        setOpenConfirmIndex(null);
        const response = await takeHintPlayMode(questId, data, session?.accessToken) as IHint;
        if (response?.text) {
            setTakenHints([...takenHints.slice(0, index), true, ...takenHints.slice(index + 1)]);
            objectHints[index] = {
                ...objectHints[index],
                ...response
            }
            const {penalty} = objectHints[index];
            setScoreText((prevState) => `${prevState} - ${penalty?.percent ? penalty.percent / 100 * reward : penalty?.score}`)
        }
        router.refresh();
    };

    const handleError = () => {
        setInputState(InputStates.ERROR);
        setSendButtonState(SendButtonStates.TIMER);

        const deadline = Date.now() + 11000;
        setSendButtonContent(<Countdown
            value={deadline}
            format={'ss'}
            valueStyle={{fontSize: '14px', color: 'var(--text-default)'}}
            onFinish={onFinish}/>)
    };

    const handleAccept = () => {
        setInputState(InputStates.ACCEPTED);
        setSendButtonContent(<SendOutlined/>);
        setSendButtonState(SendButtonStates.DISABLED);
        setAccepted(true);
        success();
    };

    const handleValueChange = () => {
        if (inputState !== InputStates.BASIC) {
            setInputState(InputStates.BASIC);
            setInputValidationStatus('');
        }
    };

    const handleAnswerValidation = (answerResponse: ITaskAnswerResponse) => {
        if (answerResponse?.accepted) {
            setInputValidationStatus('success');
            form.setFieldValue('task-answer', answerResponse.text);
            setContextData(prevState => {
                if (currentTaskGroupId) {
                    const taskGroups = prevState.task_groups;
                    const taskGroup = taskGroups
                        .find(item => item.id === currentTaskGroupId)!;
                    const taskGroupIndex = taskGroups.indexOf(taskGroup);
                    const currentTaskIndex = taskGroup.tasks.indexOf(props);
                    taskGroup.tasks[currentTaskIndex] = {
                        ...props,
                        score: answerResponse.score,
                    };
                    taskGroups[taskGroupIndex] = taskGroup;
                    return {
                        ...prevState,
                        task_groups: taskGroups,
                    };
                }
                return prevState;
            })
            handleAccept();
        } else {
            setInputValidationStatus('error');
            handleError();
        }
    };

    const handleSendAnswer = async () => {
        if (sendButtonState === SendButtonStates.DISABLED || sendButtonState === SendButtonStates.TIMER) {
            return;
        }
        const answer = form.getFieldValue('task-answer') as string;
        const data: ITaskAnswer = {
            taskID: taskId!,
            text: answer
        };

        setSendButtonState(SendButtonStates.LOADING);
        setSendButtonContent(null);
        const answerResponse = editMode ?
            {accepted: correctAnswers.includes(answer), text: answer, score: 0} :
            await answerTaskPlayMode(questId, data, session?.accessToken) as ITaskAnswerResponse;
        handleAnswerValidation(answerResponse);
    };

    return (
        <div className={'task__wrapper'}>
            {contextHolder}
            <div className={'task__text-part'}>
                {mode === TasksMode.PLAY ? (
                    <h4
                        className={classNames(
                            'roboto-flex-header task__name',
                            accepted && 'task__accepted',
                        )}
                    >
                        {name}
                        {/* Да простит меня Бог */}
                        {/* eslint-disable-next-line no-nested-ternary */}
                        {accepted ? (
                            <Tooltip title={scoreText} placement={'bottom'}>
                                <span className="task__reward-accepted">
                                    +{score}
                                </span>
                            </Tooltip>
                        ) : isExpired ? (
                            <Tooltip title={0} placement={'bottom'}>
                                <span className="task__reward">0</span>
                            </Tooltip>
                        ) : (
                            <Tooltip title={scoreText} placement={'bottom'}>
                                <span className="task__reward">
                                    {score && score > 0 ? score : currentScore}
                                </span>
                            </Tooltip>
                        )}
                    </h4>
                ) : (
                    <h4 className={'roboto-flex-header task__name'}>{name}</h4>
                )}
                {getTaskExtra(
                    mode === TasksMode.EDIT,
                    true,
                    taskGroupProps,
                    props,
                    questId,
                )}
                <Markdown
                    className={'task__question line-break'}
                    disallowedElements={['pre', 'code']}
                    remarkPlugins={[remarkGfm]}
                >
                    {question}
                </Markdown>
            </div>
            {mediaLinks && mediaLinks.length > 0 && (
                <>
                    {mediaLinks.map(link => {
                        if (
                            link.split('__')[1]?.endsWith('mp3') ||
                            link.split('__')[1]?.endsWith('wav')
                        ) {
                            return (
                                // eslint-disable-next-line jsx-a11y/media-has-caption
                                <audio
                                    key={link}
                                    controls
                                    src={link}
                                    style={{ width: '100%' }}
                                />
                            );
                        }
                        return null;
                    })}
                    <Swiper
                        slidesPerView={'auto'}
                        spaceBetween={30}
                        loop
                        pagination
                        navigation
                        observer
                        observeParents
                        onNavigationNext={(swiper) => {
                            const count = swiper.slides.length;
                            swiper.slideTo((swiper.activeIndex + 1) % count);
                        }}
                        onNavigationPrev={(swiper) => {
                            const count = swiper.slides.length;
                            swiper.slideTo(((swiper.activeIndex - 1) % count + count) % count)
                        }}
                        modules={[Pagination, Navigation]}
                    >
                        {mediaLinks.map((link, index) => {
                            if (
                                !link.split('__')[1]?.endsWith('mp3') &&
                                !link.split('__')[1]?.endsWith('wav')
                            ) {
                                return (
                                    <SwiperSlide key={`${link + index}`}>
                                        <button
                                            type={'button'}
                                            onClick={() => lightGalleryRef.current?.openGallery(index)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: 0,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Image
                                                style={{userSelect: 'none'}}
                                                src={link}
                                                alt={'task image'}
                                                width={300}
                                                height={300}
                                            />
                                        </button>
                                    </SwiperSlide>
                                );
                            }
                            return null;
                        })}
                    </Swiper>

                    <LightGallery
                        speed={500}
                        plugins={[lgThumbnail, lgZoom]}
                        showZoomInOutIcons
                        actualSize={false}
                        download={false}
                        dynamic
                        dynamicEl={mediaLinks
                            .filter(link =>
                                !link.split('__')[1]?.endsWith('mp3') &&
                                !link.split('__')[1]?.endsWith('wav'))
                            .map((link) => ({
                                src: link,
                                thumb: link
                            }))
                        }
                        onInit={(detail) => {
                            lightGalleryRef.current = detail.instance;
                        }}
                    />
                </>
            )}
            {!isExpired && objectHints && objectHints.length > 0 && (
                <div className={'task__hints-part task-hints__container'}>
                    {objectHints.map((hint, index) => (
                        <div
                            className={`task-hint__container ${
                                openConfirm && index === openConfirmIndex
                                    ? 'task-hint__container_confirm'
                                    : ''
                            } ${
                                takenHints[index] || hint.taken
                                    ? 'task-hint__container_taken'
                                    : ''
                            }`}
                            key={uid()}
                        >
                            {openConfirm && index === openConfirmIndex ? (
                                <>
                                    <div className={'hint__text-part'}>
                                        <span className={'hint__title'}>
                                            Взять подсказку?
                                        </span>
                                        <span className={'hint__text'}>
                                            {hint.penalty?.percent
                                                ? `${hint.penalty?.percent}%`
                                                : `${hint.penalty?.score} баллов`}{' '}
                                            от стоимости задачи
                                        </span>
                                    </div>
                                    <div className={'hint__confirm-buttons'}>
                                        <Button
                                            type={'primary'}
                                            onClick={() =>
                                                handleTakeHint(index)
                                            }
                                        >
                                            Да
                                        </Button>
                                        <Button
                                            type={'default'}
                                            onClick={() => {
                                                setOpenConfirm(false);
                                                setOpenConfirmIndex(null);
                                            }}
                                        >
                                            Нет
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className={'hint__title'}>
                                        {hint.name
                                            ? hint.name
                                            : `Подсказка ${index + 1}`}
                                    </span>
                                    {takenHints[index] || hint.taken ? (
                                        <Markdown
                                            className={'hint__text line-break'}
                                            disallowedElements={['pre', 'code']}
                                            remarkPlugins={[remarkGfm]}
                                        >
                                            {hint?.text}
                                        </Markdown>
                                    ) : (
                                        <Button
                                            type={'link'}
                                            onClick={() => {
                                                setOpenConfirm(true);
                                                // @ts-expect-error мы знаем индекс
                                                setOpenConfirmIndex(index);
                                            }}
                                        >
                                            Открыть
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <Form
                className={'task__answer-part'}
                layout={'inline'}
                form={form}
                initialValues={{ 'task-answer': teamAnswer ?? '' }}
            >
                <Form.Item
                    required
                    name={'task-answer'}
                    validateStatus={inputValidationStatus}
                    hasFeedback
                >
                    <Input
                        className={classNames(
                            inputState === InputStates.ACCEPTED &&
                                'task__answer-part_right',
                        )}
                        placeholder={'Ответ'}
                        onChange={handleValueChange}
                        disabled={
                            inputState === InputStates.ACCEPTED || isExpired
                        }
                        onPressEnter={handleSendAnswer}
                    />
                </Form.Item>
                <FormItem>
                    <Button
                        type={'primary'}
                        onClick={handleSendAnswer}
                        loading={sendButtonState === SendButtonStates.LOADING}
                        disabled={
                            sendButtonState !== SendButtonStates.BASIC ||
                            isExpired
                        }
                    >
                        {sendButtonContent}
                    </Button>
                </FormItem>
            </Form>
            {editMode && (
                <span>
                    {severalAnswers
                        ? 'Правильные ответы:'
                        : 'Правильный ответ:'}{' '}
                    {correctAnswers.join('; ')}
                </span>
            )}
        </div>
    );
}
