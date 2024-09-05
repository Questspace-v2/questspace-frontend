'use client';

import {
    Button,
    Col,
    ConfigProvider,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Upload,
    UploadFile
} from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react';
import {getCenter, uid} from '@/lib/utils/utils';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import {
    DeleteOutlined,
    FileImageOutlined,
    MinusOutlined,
    PlusOutlined,
    ReloadOutlined,
    UploadOutlined
} from '@ant-design/icons';

import './EditTask.scss';
import theme from '@/lib/theme/themeConfig';
import ru_RU from 'antd/lib/locale/ru_RU';
import {useTasksContext} from '@/components/Tasks/ContextProvider/ContextProvider';
import client from '@/app/api/client/client';
import {ValidationStatus} from '@/lib/utils/modalTypes';
import {useSession} from 'next-auth/react';
import {createTaskGroupsAndTasks} from '@/app/api/api';
import {TaskDto} from '@/app/api/dto/task-groups-dto/task.dto';

const {TextArea} = Input;

interface TaskCreateModalProps {
    readonly questId: string,
    readonly isOpen: boolean,
    readonly setIsOpen: Dispatch<SetStateAction<boolean>>,
    readonly taskGroupName: string,
    readonly fileList: UploadFile[],
    readonly setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>,
    readonly task?: TaskDto
}

export interface TaskForm {
    taskName: string,
    taskText: string,
    hints: string[],
    answers: string[],
    taskPoints: number
}

export default function EditTask({questId, isOpen, setIsOpen, taskGroupName, fileList, setFileList, task}: TaskCreateModalProps) {
    const {clientWidth, clientHeight} = document.body;
    const centerPosition = useMemo(() => getCenter(clientWidth, clientHeight), [clientWidth, clientHeight]);
    const { xs, md } = useBreakpoint();

    const [pointsAmount, setPointsAmount] = useState(task?.reward ?? 100);
    const {data: contextData, updater: setContextData} = useTasksContext()!;
    const [form] = Form.useForm<TaskForm>();

    const [validationStatus, setValidationStatus] = useState<ValidationStatus>('success');
    const [errorMsg, setErrorMsg] = useState<string>('');

    const taskNameError = 'Введите название задания';
    const taskTextError = 'Введите текст задания';
    const answersError = 'Добавьте хотя бы один вариант ответа';

    const {data: session} = useSession();

    useEffect(() => {
        if (task) {
            const {
                name,
                question,
                reward,
                correct_answers: correctAnswers,
                hints
            } = task;

            const formProps: TaskForm = {
                taskName: name,
                taskText: question,
                taskPoints: reward,
                hints: hints as string[],
                answers: [...correctAnswers]
            };

            form.setFieldsValue(formProps);
        }
    }, [form, task]);

    const increasePointsAmount = () => {
        setPointsAmount((prevAmount) => prevAmount + 1);
    };

    const decreasePointsAmount = () => {
        if (pointsAmount > 1) {
            setPointsAmount((prevAmount) => prevAmount - 1);
        }
    };

    const onCancel = () => {
        setErrorMsg('');
        setValidationStatus('success');
        if (!task) {
            form.resetFields();
        }
        setIsOpen(false);
    };

    const handleFieldChange = () => {
        setValidationStatus('success');
        setErrorMsg('');
    };

    const handleError = (msg: string) => {
        setErrorMsg(msg);
        setValidationStatus('error');
    };

    const handleS3Request = async () => {
        const file = fileList[0].originFileObj as File;
        const fileType = file.type;
        if (!fileType.startsWith('image/')) {
            return;
        }

        const key = `/tasks/${uid()}`;
        // eslint-disable-next-line consistent-return
        return client.handleS3Request(key, fileType, file);
    };

    const handleSaveTask = async () => {
        const taskGroups = contextData.task_groups;
        const taskGroup = taskGroups
            .find(group => group.name === taskGroupName)!;
        const taskGroupIndex = taskGroups.indexOf(taskGroup);

        const imageValidation = fileList.length > 0;
        const s3Response = (imageValidation && await handleS3Request()) ?? false;

        const fields = form.getFieldsValue();
        const {taskName, taskText, taskPoints, hints, answers} = fields;
        const pubTime = new Date();

        if (!taskName) {
            handleError(taskNameError);
            return;
        }

        if (!taskText) {
            handleError(taskTextError);
            return;
        }

        if (!answers?.length || !answers.some(item => item)) {
            handleError(answersError);
            return;
        }

        const newTask: TaskDto = {
            name: taskName,
            pub_time: pubTime.toISOString(),
            question: taskText,
            correct_answers: answers.filter(answer => answer),
            hints: hints && hints.some(item => item) ? hints.filter(hint => hint) : [],
            reward: taskPoints,
            verification_type: 'auto'
        };

        if (s3Response || task?.media_link) {
            newTask.media_link = (s3Response as Response).url ?? task?.media_link;
        }

        if (task) {
            const index = taskGroup.tasks.indexOf(task);
            taskGroup.tasks[index] = newTask;
            taskGroups[taskGroupIndex] = taskGroup;
            setContextData((prevState) => ({
                ...prevState,
                task_groups: taskGroups
            }));
            setIsOpen(false);
            await createTaskGroupsAndTasks(questId, contextData, session?.accessToken);
            return;
        }

        taskGroup.tasks.push(newTask);
        taskGroups[taskGroupIndex] = taskGroup;
        setContextData((prevState) => ({
            ...prevState,
            task_groups: taskGroups
        }));
        form.resetFields();
        fileList.splice(0, fileList.length);
        setIsOpen(false);
        await createTaskGroupsAndTasks(questId, contextData, session?.accessToken);
    }

    return (
        <ConfigProvider theme={theme} locale={ru_RU}>
            <Modal
                className={'edit-task__modal'}
                classNames={{content: 'edit-task__content'}}
                open={isOpen}
                width={xs ?? md ? '100%': 800}
                centered
                destroyOnClose
                mousePosition={centerPosition}
                title={<h3 className={'roboto-flex-header'}>Редактирование задачи</h3>}
                onCancel={onCancel}
                footer={[
                    <Button key={'save'} type={'primary'} onClick={handleSaveTask}>
                        Сохранить изменения
                    </Button>,
                    <Button key={'cancel'} onClick={onCancel}>
                        Отменить
                    </Button>
                ]}
                forceRender
            >
                <Form
                    form={form}
                    fields={[
                        {name: 'taskPoints', value: pointsAmount}
                    ]}
                    autoComplete={'off'}
                    preserve={false}
                >
                    <Row>
                        <Col className={'edit-task__labels'}>
                            <span>Название задания</span>
                        </Col>
                        <Col flex={'auto'}>
                            <Form.Item
                                name={'taskName'}
                                help={errorMsg === taskNameError ? errorMsg : ''}
                                validateStatus={errorMsg === taskNameError ? validationStatus : 'success'}
                            >
                                <Input
                                    type={'text'}
                                    placeholder={'Название задания'}
                                    onChange={handleFieldChange}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={'edit-task__labels'}>
                            <span>Текст задания</span>
                        </Col>
                        <Col flex={'auto'}>
                            <Form.Item
                                name={'taskText'}
                                help={errorMsg === taskTextError ? errorMsg : ''}
                                validateStatus={errorMsg === taskTextError ? validationStatus : 'success'}
                            >
                                <TextArea
                                    placeholder={'Текст задания'}
                                    style={{resize: 'none', height: '320px'}}
                                    onChange={handleFieldChange}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={'edit-task__labels'}>
                            <span>Картинка</span>
                        </Col>
                        <Col flex={'auto'}>
                            <FormItem>
                                <Upload
                                    maxCount={1}
                                    showUploadList={false}
                                    fileList={fileList} onChange={({ fileList: fllst }) => setFileList(fllst)}>
                                    {/* eslint-disable-next-line no-constant-condition */}
                                    {fileList.length > 0 ? (
                                        <Button><ReloadOutlined />Заменить</Button>
                                    ) : (
                                        <Button><UploadOutlined />Загрузить</Button>
                                    )}
                                </Upload>
                                {fileList.length > 0 && <div className={'quest-editor__image-file'}><FileImageOutlined /><p>{fileList[0].originFileObj?.name}</p></div>}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={'edit-task__labels'}>
                            <span>Подсказки (max 3)<span style={{ color: '#00000073' }}><br/>поддерживает Markdown</span></span>
                        </Col>
                        <Col flex={'auto'}>
                            <Form.List name={'hints'}>
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Form.Item label={`${index + 1}`} key={field.key}>
                                                <Form.Item key={field.key} name={field.name}>
                                                    <Input
                                                        placeholder={'Введите подсказку'}
                                                        suffix={<DeleteOutlined onClick={() => remove(field.name)}/>}
                                                    />
                                                </Form.Item>
                                            </Form.Item>
                                        ))}
                                        <FormItem>
                                            <Button
                                                onClick={() => add()}
                                                disabled={fields.length >= 3}
                                            >
                                                <PlusOutlined/> Добавить подсказку
                                            </Button>
                                        </FormItem>
                                    </>
                                )}
                            </Form.List>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={'edit-task__labels'}>
                            <span>Варианты ответа</span>
                        </Col>
                        <Col flex={'auto'}>
                            <Form.List name={'answers'}>
                                {(fields, { add, remove }) => (
                                    <>
                                        {errorMsg === answersError
                                            && <p style={{color: 'red'}}>{errorMsg}</p>}
                                        {fields.map((field, index) => (
                                            <Form.Item label={`${index + 1}`} key={field.key}>
                                                <Form.Item
                                                    key={field.key}
                                                    name={field.name}
                                                    validateStatus={index === 0 &&
                                                        errorMsg === answersError ? validationStatus : 'success'}
                                                >
                                                    <Input
                                                        placeholder={'Введите вариант ответа'}
                                                        suffix={<DeleteOutlined onClick={() => {
                                                            remove(field.name);
                                                            handleFieldChange();
                                                        }}/>}
                                                        onChange={handleFieldChange}
                                                    />
                                                </Form.Item>
                                            </Form.Item>
                                        ))}
                                        <FormItem>
                                            <Button onClick={() => {
                                                add();
                                                handleFieldChange();
                                            }}>
                                                <PlusOutlined/> Добавить вариант ответа
                                            </Button>
                                        </FormItem>
                                    </>
                                )}
                            </Form.List>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={'edit-task__labels'}>
                            <span>Баллы за задание</span>
                        </Col>
                        <Col flex={'auto'}>
                            <FormItem name={'taskPoints'}>
                                <InputNumber
                                    addonBefore={
                                        <MinusOutlined
                                            onClick={decreasePointsAmount}
                                        />}
                                    addonAfter={
                                        <PlusOutlined
                                            onClick={increasePointsAmount}
                                        />}
                                    controls={false}
                                    min={task?.reward ?? 1}
                                    style={{width: '128px', textAlignLast: 'center'}}
                                    onChange={(value) => {
                                        setPointsAmount(value ?? (task?.reward ?? 100));
                                    }}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </ConfigProvider>
    );
}
