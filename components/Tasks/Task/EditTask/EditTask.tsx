'use client';

import {
    Button,
    Col,
    ConfigProvider,
    Form,
    Input,
    InputNumber,
    Row,
    Upload,
    UploadFile, UploadProps
} from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {uid} from '@/lib/utils/utils';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import {
    DeleteOutlined,
    FileImageOutlined,
    MinusOutlined,
    PlusOutlined,
    ReloadOutlined,
    UploadOutlined
} from '@ant-design/icons';
import theme from '@/lib/theme/themeConfig';
import ru_RU from 'antd/lib/locale/ru_RU';
import {useTasksContext} from "@/components/Tasks/ContextProvider/ContextProvider";
import {
    IBulkEditTaskGroups,
    ITask,
    ITaskGroup,
    ITaskGroupsAdminResponse,
    ITaskGroupsUpdate,
} from '@/app/types/quest-interfaces';
import client from "@/app/api/client/client";
import {ValidationStatus} from "@/lib/utils/modalTypes";
import {useSession} from "next-auth/react";
import {patchTaskGroups} from "@/app/api/api";
import classNames from 'classnames';
import CustomModal, { customModalClassname } from '@/components/CustomModal/CustomModal';

const {TextArea} = Input;

interface TaskCreateModalProps {
    questId: string,
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    taskGroupProps: Pick<ITaskGroup, 'id' | 'pub_time' | 'name'>
    fileList: UploadFile[],
    setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>,
    task?: ITask
}

export interface TaskForm {
    taskName: string,
    taskText: string,
    hints: string[],
    answers: string[],
    taskPoints: number
}

export default function EditTask({questId, isOpen, setIsOpen, taskGroupProps, fileList, setFileList, task}: TaskCreateModalProps) {
    const { xs, md } = useBreakpoint();

    const [pointsAmount, setPointsAmount] = useState(task?.reward ?? 100);
    const {data: contextData, updater: setContextData} = useTasksContext()!;
    const [form] = Form.useForm<TaskForm>();

    const [validationStatus, setValidationStatus] = useState<ValidationStatus>('success');
    const [errorMsg, setErrorMsg] = useState<string>('');

    const taskNameError = 'Введите название задания';
    const taskTextError = 'Введите текст задания';
    const answersError = 'Добавьте хотя бы один вариант ответа';
    const fileIsTooBigError = 'Файл слишком большой';
    const unsupportedFileTypeError = 'Неподдерживаемый тип файла';

    const {data: session} = useSession();

    const [fileIsTooBig, setFileIsTooBig] = useState(false);
    const [unsupportedFileType, setUnsupportedFileType] = useState(false);

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
                answers: correctAnswers
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
            setFileList([]);
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

    const handleUploadValueChange: UploadProps['onChange'] = (info) => {
        const isMoreThan5Mb = Boolean(info.file.size && info.file.size / 1024 / 1024 >= 20);
        const isFileTypeUnsupported = !info.file.type?.startsWith('image/');
        setFileList(info.fileList);
        setFileIsTooBig(isMoreThan5Mb);
        setUnsupportedFileType(isFileTypeUnsupported);
    };

    const handleS3Request = async () => {
        const file = fileList[0].originFileObj as File;
        const fileType = file.type;
        if (unsupportedFileType || fileIsTooBig) {
            return;
        }

        const key = `/tasks/${uid()}`;
        // eslint-disable-next-line consistent-return
        return client.handleS3Request(key, fileType, file);
    };

    const handleSaveTask = async () => {
        const taskGroups = contextData.task_groups;
        const taskGroup = taskGroups
            .find(group => group.id === taskGroupProps.id && group.pub_time === taskGroupProps.pub_time)!;
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

        if (fileIsTooBig) {
            handleError(fileIsTooBigError);
            return;
        }

        if (unsupportedFileType) {
            handleError(unsupportedFileTypeError);
            return;
        }

        const newTask: ITask = {
            name: taskName,
            pub_time: pubTime.toISOString(),
            question: taskText,
            correct_answers: answers.filter(answer => answer),
            hints: hints && hints.some(item => item) ? hints.filter(hint => hint) : [],
            reward: taskPoints,
            verification: 'auto'
        };

        if (s3Response || task?.media_link) {
            newTask.media_link = (s3Response as Response).url ?? task?.media_link;
        }

        if (task) {
            const index = taskGroup.tasks.indexOf(task);
            taskGroup.tasks[index] = newTask;
            taskGroups[taskGroupIndex] = taskGroup;

            const updateTaskGroup: ITaskGroupsUpdate = {
                id: taskGroup.id!,
                name: taskGroup.name,
                order_idx: taskGroup.order_idx!,
                pub_time: taskGroup.pub_time!,
                tasks: {
                    update: [
                        {...newTask, group_id: taskGroup.id!, order_idx: index, id: task.id}
                    ]
                }
            };

            const requestData: IBulkEditTaskGroups = {
                update: [updateTaskGroup],
            };

            const data = await patchTaskGroups(
                questId, requestData, session?.accessToken
            ) as ITaskGroupsAdminResponse;

            setContextData({
                ...contextData,
                task_groups: data.task_groups,
            });
            setIsOpen(false);
            return;
        }

        if (taskGroup.tasks) {
            taskGroup.tasks.push(newTask);
        } else {
            taskGroup.tasks = [newTask];
        }

        taskGroups[taskGroupIndex] = taskGroup;

        const updateTaskGroup: ITaskGroupsUpdate = {
            id: taskGroup.id!,
            name: taskGroup.name,
            order_idx: taskGroup.order_idx!,
            pub_time: taskGroup.pub_time!,
            tasks: {
                create: [
                    {...newTask, group_id: taskGroup.id!, order_idx: taskGroup.tasks.length - 1}
                ]
            }
        };

        const requestData: IBulkEditTaskGroups = {
            update: [updateTaskGroup]
        };

        const data = await patchTaskGroups(
            questId, requestData, session?.accessToken
        ) as ITaskGroupsAdminResponse;

        setContextData({
            ...contextData,
            task_groups: data.task_groups,
        });
        form.resetFields();
        setFileList([]);
        setIsOpen(false);
    }

    const getImageErrorText = () => {
        if (unsupportedFileType) {
            return unsupportedFileTypeError;
        }

        return fileIsTooBigError;

    }

    return (
        <ConfigProvider theme={theme} locale={ru_RU}>
            <CustomModal
                classNames={{content: 'edit-task__content'}}
                open={isOpen}
                width={xs ?? md ? '100%': 800}
                centered
                destroyOnClose
                title={<h3 className={classNames(`${customModalClassname}-header`, 'roboto-flex-header')}>Редактирование задачи</h3>}
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
                    noValidate
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
                            <Form.Item
                                validateStatus={fileIsTooBig || unsupportedFileType ? 'error' : ''}
                                help={fileIsTooBig || unsupportedFileType &&
                                    <p className={'edit-task__image-validation-error'}>{getImageErrorText()}</p>}
                                colon={false}
                                className={'edit-task__image-form-item'}
                            >
                                <Upload
                                    maxCount={1}
                                    accept={'image/*'}
                                    showUploadList={false}
                                    fileList={fileList}
                                    onChange={handleUploadValueChange}
                                >
                                    {fileList.length > 0 ? (
                                        <Button><ReloadOutlined />Заменить</Button>
                                    ) : (
                                        <Button><UploadOutlined />Загрузить</Button>
                                    )}
                                </Upload>
                                {fileList.length > 0 && <div className={'edit-task__image'}><FileImageOutlined /><p>{fileList[0].originFileObj?.name}</p></div>}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={'edit-task__labels'}>
                            <span>
                                Варианты ответа
                                <span className={'light-description'}><br />Ответы принимаются регистронезависимо</span>
                            </span>
                        </Col>
                        <Col flex={'auto'} className={'edit-task__answers-list'}>
                        <Form.List name={'answers'}>
                                {(fields, { add, remove }) => (
                                    <>
                                        {errorMsg === answersError
                                            && <p style={{color: 'red'}}>{errorMsg}</p>}
                                        {fields.map((field, index) => (
                                            <Form.Item key={field.key}>
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
                                        <Form.Item>
                                            <Button
                                                className={'edit-task__add-button'}
                                                onClick={() => {
                                                    add();
                                                    handleFieldChange();
                                                }}
                                                type={'link'}
                                            >
                                                <PlusOutlined/> Добавить вариант ответа
                                            </Button>
                                        </Form.Item>
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
                                    type={'number'}
                                    controls={false}
                                    step={100}
                                    min={0}
                                    style={{width: '128px', textAlignLast: 'center'}}
                                    onChange={(value) => {
                                        setPointsAmount(value ?? (task?.reward ?? 100));
                                    }}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={'edit-task__labels'}>
                            <span>Подсказки (max 3)<span className={'light-description'}><br/>поддерживает Markdown</span></span>
                        </Col>
                        <Col flex={'auto'} className={'edit-task__hints-list'}>
                            <Form.List name={'hints'}>
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field) => (
                                            <Form.Item key={field.key}>
                                                <Form.Item key={field.key} name={field.name}>
                                                    <Input
                                                        placeholder={'Введите подсказку'}
                                                        suffix={<DeleteOutlined onClick={() => remove(field.name)}/>}
                                                    />
                                                </Form.Item>
                                            </Form.Item>
                                        ))}
                                        <Form.Item>
                                            <Button
                                                className={'edit-task__add-button'}
                                                onClick={() => add()}
                                                disabled={fields.length >= 3}
                                                type={'link'}
                                            >
                                                <PlusOutlined/> Добавить подсказку
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Col>
                    </Row>
                </Form>
            </CustomModal>
        </ConfigProvider>
    );
}
