'use client';

import Image from 'next/image';
import { uid } from '@/lib/utils/utils';
import { Button, CountdownProps, Form, Input, message, Statistic } from 'antd';
import { IHintRequest, ITask, ITaskAnswer, ITaskAnswerResponse } from '@/app/types/quest-interfaces';
import { SendOutlined } from '@ant-design/icons';
import FormItem from 'antd/lib/form/FormItem';
import { getTaskExtra, TasksMode } from '@/components/Tasks/Tasks.helpers';
import { answerTaskPlayMode, takeHintPlayMode } from '@/app/api/api';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import './Task.css';
import { useRouter } from 'next/navigation';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
    taskGroupName: string
}

export default function Task({mode, props, questId, taskGroupName}: TaskProps) {
    const {name, question, hints, media_link: mediaLink, correct_answers: correctAnswers, id: taskId, answer: teamAnswer} = props;
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openConfirmIndex, setOpenConfirmIndex] = useState<0 | 1 | 2 | null>(null);
    const [takenHints, setTakenHints] = useState([false, false, false]);

    const transformHints = () => hints.map(hint => ({
        taken: false,
        text: hint as string
    }));
    const objectHints = hints.length && typeof hints[0] === 'string' ? transformHints() : hints as {taken: boolean, text?: string}[];

    const editMode = mode === TasksMode.EDIT;
    const severalAnswers = editMode ? correctAnswers.length > 1 : false;
    const [form] = Form.useForm();
    const {data: session} = useSession();
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();

    const [sendButtonState, setSendButtonState] = useState<SendButtonStates>(teamAnswer ? SendButtonStates.DISABLED : SendButtonStates.BASIC);
    const [inputState, setInputState] = useState<InputStates>(teamAnswer ? InputStates.ACCEPTED : InputStates.BASIC);
    const [sendButtonContent, setSendButtonContent] = useState<JSX.Element | null>(<SendOutlined/>);
    const [inputValidationStatus, setInputValidationStatus] = useState<'success' | 'error' | ''>(teamAnswer ? 'success' : '');
    const [textColor, setTextColor] = useState(teamAnswer ? '#389e0d' : '#262626');

    const onFinish: CountdownProps['onFinish'] = () => {
        setSendButtonContent(<SendOutlined/>);
        setSendButtonState(SendButtonStates.BASIC);
    };

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
        await takeHintPlayMode(questId, data, session?.accessToken);
        router.refresh();
    };

    const handleError = () => {
        setInputState(InputStates.ERROR);
        setSendButtonState(SendButtonStates.TIMER);

        const deadline = Date.now() + 11000;
        setSendButtonContent(<Countdown
            value={deadline}
            format={'ss'}
            valueStyle={{fontSize: '14px', color: '#1890ff'}}
            onFinish={onFinish}/>)
    };

    const handleAccept = () => {
        setTextColor('#389e0d');
        setInputState(InputStates.ACCEPTED);
        setSendButtonContent(<SendOutlined/>);
        setSendButtonState(SendButtonStates.DISABLED);
        success();
    };

    const handleValueChange = () => {
        if (inputState !== InputStates.BASIC) {
            setInputState(InputStates.BASIC);
            setInputValidationStatus('');
        }
    };

    const handleAnswerValidation = (answerResponse: ITaskAnswerResponse) => {
        if (answerResponse.accepted) {
            setInputValidationStatus('success');
            handleAccept();
        } else {
            setInputValidationStatus('error');
            handleError();
        }
    };

    const handleSendAnswer = async () => {
        const answer = form.getFieldValue('task-answer') as string;
        const data: ITaskAnswer = {
            taskID: taskId!,
            text: answer
        };

        setSendButtonState(SendButtonStates.LOADING);
        setSendButtonContent(null);
        const answerResponse = await answerTaskPlayMode(questId, data, session?.accessToken) as ITaskAnswerResponse;
        handleAnswerValidation(answerResponse);
    };

    return (
        <div className={'task__wrapper'}>
            {contextHolder}
            <div className={'task__text-part'}>
                <h4 className={'roboto-flex-header task__name'}>{name}</h4>
                {getTaskExtra(mode === TasksMode.EDIT, true, taskGroupName, props)}
                <Markdown className={'task__question line-break'} disallowedElements={['pre', 'code']} remarkPlugins={[remarkGfm]}>{question}</Markdown>
            </div>
            {mediaLink && (
                <div className={'task__image-part task-image__container'}>
                    <Image src={mediaLink} alt={'task image'} width={300} height={300}/>
                </div>
            )}
            {hints.length > 0 && (
                <div className={'task__hints-part task-hints__container'}>
                    {objectHints.map((hint, index) =>
                        <div className={`task-hint__container ${openConfirm && index === openConfirmIndex ? 'task-hint__container_confirm' : ''} ${takenHints[index] || hint.taken ? 'task-hint__container_taken' : ''}`} key={uid()}>
                            {openConfirm && index === openConfirmIndex ? (
                                <>
                                    <div className={'hint__text-part'}>
                                        <span className={'hint__title'}>Взять подсказку?</span>
                                        <span className={'hint__text'}>Вы потеряете 20% баллов</span>
                                    </div>
                                    <div className={'hint__confirm-buttons'}>
                                        <Button type={'primary'} onClick={() => handleTakeHint(index)}>Да</Button>
                                        <Button type={'default'} onClick={() => {setOpenConfirm(false); setOpenConfirmIndex(null)}}>Нет</Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className={'hint__title'}>Подсказка {index + 1}</span>
                                    {takenHints[index] || hint.taken ?
                                        <Markdown className={'hint__text line-break'} disallowedElements={['pre', 'code']} remarkPlugins={[remarkGfm]}>{hint?.text}</Markdown> :
                                        <Button type={'link'} onClick={() => {
                                            setOpenConfirm(true);
                                            // @ts-expect-error мы знаем индекс
                                            setOpenConfirmIndex(index)
                                        }}>Открыть</Button>
                                    }
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
            <Form
                className={'task__answer-part'}
                layout={'inline'}
                form={form}
                initialValues={[
                    {name: 'task-answer', value: teamAnswer ?? ''}
                ]}
            >
                <Form.Item required
                           name={'task-answer'}
                           validateStatus={inputValidationStatus}
                           hasFeedback>
                    <Input
                        placeholder={'Ответ'}
                        style={{borderRadius: 2, color: textColor}}
                        onChange={handleValueChange}
                        disabled={inputState === InputStates.ACCEPTED} onPressEnter={handleSendAnswer}/>
                </Form.Item>
                <FormItem>
                    <Button
                        type={'primary'}
                        onClick={handleSendAnswer}
                        loading={sendButtonState === SendButtonStates.LOADING}
                        disabled={sendButtonState !== SendButtonStates.BASIC}
                    >{sendButtonContent}</Button>
                </FormItem>
            </Form>
            {editMode && (<span>{severalAnswers ? 'Правильные ответы:' : 'Правильный ответ:'} {correctAnswers.join('; ')}</span>)}
        </div>
    );
}
