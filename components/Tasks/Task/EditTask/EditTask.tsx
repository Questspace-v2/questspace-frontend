'use client';

import {
    Button, Checkbox,
    Col,
    ConfigProvider,
    Form,
    Input,
    InputNumber,
    Row,
    Upload,
    UploadFile, UploadProps,
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
} from '@ant-design/icons';
import theme from '@/lib/theme/themeConfig';
import ru_RU from 'antd/lib/locale/ru_RU';
import {useTasksContext} from "@/components/Tasks/ContextProvider/ContextProvider";
import {
    IBulkEditTaskGroups, IHint,
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
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ItemRender } from 'antd/es/upload/interface';

interface DraggableUploadListItemProps {
    remove: () => void;
    file: UploadFile<unknown>;
}

const {TextArea} = Input;

const supportedFileTypes = [
    'image/gif',
    'image/jpeg',
    'image/png',
    'audio/wav',
    'audio/mpeg'
];

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
    hintsFull: IHint[],
    answers: string[],
    taskPoints: number
}

interface FileObject {
    uid: string;
    name: string;
    url: string;
}

function DraggableUploadListItem({ file, remove }: DraggableUploadListItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: file.uid,
    });

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition,
        cursor: 'move',
        touchAction: 'none'
    };

    return (
        <div
            className={'edit-task__image'}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <FileImageOutlined/>
            <p className={'edit-task__image__name'}>{file.name}</p>
            <DeleteOutlined onClick={() => remove()} className={'edit-task__delete-image-button'}/>
        </div>
    );
}

export default function EditTask({questId, isOpen, setIsOpen, taskGroupProps, fileList, setFileList, task}: TaskCreateModalProps) {
    const {xs, md} = useBreakpoint();

    const [pointsAmount, setPointsAmount] = useState(task?.reward ?? 100);
    const {data: contextData, updater: setContextData} = useTasksContext()!;
    const [form] = Form.useForm<TaskForm>();

    const taskNameError = 'Введите название задания';
    const taskTextError = 'Введите текст задания';
    const answersError = 'Добавьте хотя бы один вариант ответа';
    const fileIsTooBigError = 'Файл слишком большой';
    const unsupportedFileTypeError = 'Неподдерживаемый тип файла';

    const {data: session} = useSession();

    const [fileIsTooBig, setFileIsTooBig] = useState(false);
    const [unsupportedFileType, setUnsupportedFileType] = useState(false);

    const defaultFileObjects = task?.media_links?.map((link, index) => {
        const fileName = decodeURIComponent(link.split('__')[1] ?? 'file');
        return {
            uid: index.toString(),
            name: fileName,
            url: link,
        };
    });
    const [defaultFileList, setDefaultFileList] = useState<FileObject[]>(defaultFileObjects ?? []);
    const [allFilesList, setAllFilesList] = useState([...defaultFileList, ...fileList]);

    const sensor = useSensor(PointerSensor, {
        activationConstraint: { distance: 10 },
    });

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            setAllFilesList((prev) => {
                const activeIndex = prev.findIndex((i) => i.uid === active.id);
                const overIndex = prev.findIndex((i) => i.uid === over?.id);
                return arrayMove(prev, activeIndex, overIndex);
            });
        }
    };

    const defaultFieldsValidationStatus: Record<string, ValidationStatus> = {
        taskName: 'success',
        taskText: 'success',
        answers: 'success',
        files: 'success',
    };
    const [fieldsValidationStatus, setFieldsValidationStatus] = useState(defaultFieldsValidationStatus);

    useEffect(() => {
        if (task) {
            const {
                name,
                question,
                reward,
                correct_answers: correctAnswers,
                hints,
                hints_full: hintsFull,
            } = task;

            const formProps: TaskForm = {
                taskName: name,
                taskText: question,
                taskPoints: reward,
                hints: hints as string[],
                hintsFull: hintsFull.reduce((acc, item) => {
                    // @ts-expect-error
                    acc.push({
                        ...item,
                        defaultPenalty: item.penalty?.percent === 20
                    })
                    return acc
                }, []),
                answers: correctAnswers
            };

            form.setFieldsValue(formProps);
        }
    }, [form, task, isOpen]);

    useEffect(() => {
        setAllFilesList(() => [...defaultFileList, ...fileList]);
    }, [defaultFileList, fileList]);

    const increasePointsAmount = () => {
        setPointsAmount((prevAmount) => prevAmount + 1);
    };

    const decreasePointsAmount = () => {
        if (pointsAmount > 1) {
            setPointsAmount((prevAmount) => prevAmount - 1);
        }
    };

    const onCancel = () => {
        if (!task) {
            form.resetFields();
            setFileList([]);
        }
        setFieldsValidationStatus(() => defaultFieldsValidationStatus);
        setIsOpen(false);
    };

    const handleFieldChange = (fieldName: string) => {
        setFieldsValidationStatus(prevState => ({
            ...prevState,
            [fieldName]: 'success',
        }));
    };

    const handleUploadValueChange: UploadProps['onChange'] = (info) => {
        if (info.file.type) {
            const isMoreThan5Mb = Boolean(info.file.size && info.file.size / 1024 / 1024 >= 20);
            const isFileTypeUnsupported = supportedFileTypes
                .filter(value => info.file.type === value).length === 0;
            setFileList(() => info.fileList.filter(item => item.type));
            const hasUnsupportedFileTypes = info.fileList
                .some(item => item.type && !supportedFileTypes.includes(item.type ?? ''));
            setFileIsTooBig(isMoreThan5Mb);
            setUnsupportedFileType(isFileTypeUnsupported || hasUnsupportedFileTypes);
        } else {
            setDefaultFileList(prevState => prevState.filter(item => item.uid !== info.file.uid));
        }
    };

    const getFileLinks = async () => {
        const links = allFilesList.map(async item => {
            if (!item.url) {
                const file = (item as UploadFile<unknown>).originFileObj as File;
                const fileType = file.type;
                const key = `tasks/${uid()}__${encodeURIComponent(file.name)}`;
                const resp = await client.handleS3Request(key, fileType, file);
                return resp.url;
            }
            return Promise.resolve(item.url);
        });
        return Promise.all(links);
    };

    const handleValidation = async () =>
        form.validateFields()
            .then(values => {
                if (!values.taskName || !values.taskText || !values.answers ||
                    !values.answers.some(item => item) || fileIsTooBig || unsupportedFileType) {
                        setFieldsValidationStatus(prevState => ({
                            ...prevState,
                            taskName: !values.taskName ? 'error' : prevState.taskName,
                            taskText: !values.taskText ? 'error' : prevState.taskText,
                            answers: (!values.answers || !values.answers.some(item => item)) ? 'error' : prevState.answers,
                            files: (fileIsTooBig || unsupportedFileType) ? 'error' : prevState.files,
                        }));
                        return null;
                }
                return values;
            })
            .catch(err => {
                throw err
            });

    const handleSaveTask = async () => {
        const taskGroups = contextData.task_groups;
        const taskGroup = taskGroups
            .find(group => group.id === taskGroupProps.id && group.pub_time === taskGroupProps.pub_time)!;
        const taskGroupIndex = taskGroups.indexOf(taskGroup);

        const fields = form.getFieldsValue();
        console.log(fields)
        const {taskName, taskText, taskPoints, hints, hintsFull, answers} = fields;
        const pubTime = new Date();

        const formData = await handleValidation();
        if (!formData) {
            return;
        }

        const newTask: ITask = {
            name: taskName,
            pub_time: pubTime.toISOString(),
            question: taskText,
            correct_answers: answers.filter(answer => answer),
            hints: hints && hints.some(item => item) ? hints.filter(hint => hint) : [],
            hints_full: hintsFull && hintsFull.some(item => item.text) ?
                hintsFull.filter(hint => hint?.text).map((hint => ({
                    ...hint,
                    name: hint.name?.trim(),
                    penalty: {
                        percent: 20
                    },
                }))) :
                [],
            reward: taskPoints,
            verification: 'auto'
        };

        const fileLinks = await getFileLinks();
        newTask.media_links = fileLinks;

        if (task) {
            const index = taskGroup.tasks.indexOf(task);
            console.log(index)
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
    };

    const getImageErrorText = () => {
        if (unsupportedFileType) {
            return unsupportedFileTypeError;
        }

        return fileIsTooBigError;
    };

    const renderUploadListItem: ItemRender = (_originNode, file, _, { remove }) =>
        <DraggableUploadListItem file={file} remove={remove} />;

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
                                help={fieldsValidationStatus.taskName === 'error' ? taskNameError : ''}
                                validateStatus={fieldsValidationStatus.taskName}
                            >
                                <Input
                                    type={'text'}
                                    placeholder={'Название задания'}
                                    onChange={() => handleFieldChange('taskName')}
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
                                help={fieldsValidationStatus.taskText === 'error' ? taskTextError : ''}
                                validateStatus={fieldsValidationStatus.taskText}
                            >
                                <TextArea
                                    placeholder={'Текст задания'}
                                    style={{resize: 'none', height: '320px'}}
                                    onChange={() => handleFieldChange('taskText')}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={'edit-task__labels'}>
                            <span>Файлы (max 5)</span>
                        </Col>
                        <Col flex={'auto'}>
                            <Form.Item
                                validateStatus={fieldsValidationStatus.files}
                                help={fileIsTooBig || unsupportedFileType &&
                                    <p className={'edit-task__image-validation-error'}>{getImageErrorText()}</p>}
                                colon={false}
                                className={'edit-task__image-form-item-new'}
                            >
                                <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
                                    <SortableContext items={allFilesList.map((i) => i.uid)} strategy={verticalListSortingStrategy}>
                                        <Upload
                                            maxCount={5}
                                            fileList={allFilesList}
                                            onChange={handleUploadValueChange}
                                            className={'edit-task__drag'}
                                            itemRender={renderUploadListItem}
                                            accept={supportedFileTypes.join(',')}
                                        >
                                            <Button type={'link'}
                                                    className={'edit-task__add-file-button'}><PlusOutlined /> Добавить
                                                файл</Button>
                                            <p className={'edit-task__file-extensions'}>jpg, jpeg, png, gif,
                                                mp3, wav до 20Мб</p>
                                        </Upload>
                                    </SortableContext>
                                </DndContext>
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
                        {fieldsValidationStatus.answers === 'error' &&
                            <p className='edit-task__answers-error'>{answersError}</p>}
                        <Form.List name={'answers'}>
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Form.Item key={field.key}>
                                                <Form.Item
                                                    key={field.key}
                                                    name={field.name}
                                                    validateStatus={index === 0 ? fieldsValidationStatus.answers : 'success'}
                                                >
                                                    <Input
                                                        placeholder={'Введите вариант ответа'}
                                                        suffix={<DeleteOutlined onClick={() => {
                                                            remove(field.name);
                                                            handleFieldChange('answers');
                                                        }}/>}
                                                        onChange={() => handleFieldChange('answers')}
                                                    />
                                                </Form.Item>
                                            </Form.Item>
                                        ))}
                                        <Form.Item>
                                            <Button
                                                className={'edit-task__add-button'}
                                                onClick={() => {
                                                    add();
                                                    handleFieldChange('answers');
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
                            <Form.List name={'hintsFull'}>
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <div className={'task-hint__wrapper'} key={key}>
                                                <div className={'task-hint__name'}>
                                                    <Form.Item
                                                        name={[key, 'name']}
                                                        {...restField}
                                                        className={classNames('task-hint__form-item')}
                                                    >
                                                        <Input
                                                            placeholder={`Подсказка ${name + 1}`}
                                                        />
                                                    </Form.Item>
                                                    <Button danger onClick={() => remove(name)}>
                                                        <DeleteOutlined />
                                                    </Button>
                                                </div>
                                                <Form.Item
                                                    name={[key, 'text']}
                                                    {...restField}
                                                    className={classNames('task-hint__form-item')}
                                                >
                                                    <TextArea
                                                        style={{resize: 'none', width: '100%'}}
                                                        placeholder={'Текст подсказки'}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    name={[key, 'penalty']}
                                                    {...restField}
                                                    className={classNames('task-hint__form-item')}
                                                >
                                                    <Form.Item
                                                        name={[key, 'penalty', 'score']}
                                                        {...restField}
                                                        labelAlign={'left'}
                                                        label={'Стоимость подсказки'}
                                                        colon={false}
                                                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return

                                                    >
                                                        {(() => {
                                                            const disabled = !!form.getFieldValue([
                                                                "hintsFull",
                                                                'options',
                                                                key,
                                                                "defaultPenalty"
                                                            ]);

                                                            console.log(disabled);

                                                            return (
                                                                <InputNumber
                                                                    type={'number'}
                                                                    controls={false}
                                                                    defaultValue={60}
                                                                    disabled={disabled}
                                                                    min={1}
                                                                    style={{ width: '128px', maxWidth: '128px', textAlignLast: 'center' }}
                                                                />
                                                            );
                                                        })()}
                                                    </Form.Item>
                                                    <Form.Item
                                                        name={['options', key, 'defaultPenalty']}
                                                        valuePropName={'checked'}
                                                        {...restField}
                                                        className={classNames('task-hint__form-item')}
                                                    >
                                                        <Checkbox>20% от стоимости задания</Checkbox>
                                                    </Form.Item>
                                                </Form.Item>
                                            </div>
                                        ))}
                                        <Form.Item>
                                            <Button
                                                className={'edit-task__add-button'}
                                                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                                                onClick={() => add({penalty: {score: 60}, defaultPenalty: true}, (form.getFieldValue('hintsFull') ?? []).length)}
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
