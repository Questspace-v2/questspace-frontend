'use client';

import {Button, Col, ConfigProvider, Form, Input, InputNumber, Modal, Row, Upload, UploadFile} from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
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

import './EditTask.css';
import theme from '@/lib/theme/themeConfig';
import ru_RU from 'antd/lib/locale/ru_RU';
import {useTasksContext} from "@/components/Tasks/ContextProvider/ContextProvider";
import {ITask, ITaskGroup} from "@/app/types/quest-interfaces";
import client from "@/app/api/client/client";

const {TextArea} = Input;

interface TaskCreateModalProps {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    taskGroupName: string,
    fileList: UploadFile[],
    setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>
}

interface TaskForm {
    taskName: string,
    taskText: string,
    hints: string[],
    answers: string[],
    taskPoints: number
}

export default function EditTask({isOpen, setIsOpen, taskGroupName, fileList, setFileList}: TaskCreateModalProps) {
    const {clientWidth, clientHeight} = document.body;
    const centerPosition = useMemo(() => getCenter(clientWidth, clientHeight), [clientWidth, clientHeight]);
    const [form] = Form.useForm();
    const { xs, md } = useBreakpoint();

    const [pointsAmount, setPointsAmount] = useState(0);
    const {data: contextData, updater: setContextData} = useTasksContext()!;

    const increasePointsAmount = () => {
        setPointsAmount((prevAmount) => prevAmount + 1);
    };

    const decreasePointsAmount = () => {
        if (pointsAmount > 1) {
            setPointsAmount((prevAmount) => prevAmount - 1);
        }
    };

    const onCancel = () => {
        setIsOpen(false);
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
    }

    const handleSaveTask = async () => {
        const taskGroup = contextData.task_groups
            .find(group => group.name === taskGroupName)!;
        const unchangedGroups = contextData.task_groups
            .filter(group => group.name !== taskGroup?.name);

        const imageValidation = fileList.length > 0;
        const s3Response = imageValidation && await handleS3Request();

        if (!s3Response) {
            return;
        }

        const fields = form.getFieldsValue() as TaskForm;
        const {taskName, taskText, taskPoints, hints, answers} = fields;
        const pubTime = new Date();

        const newTask: ITask = {
            name: taskName,
            pub_time: pubTime.toISOString(),
            question: taskText,
            correct_answers: answers,
            hints,
            reward: taskPoints,
            media_link: s3Response.url,
            verification_type: 'auto'
        };

        const updatedGroup: ITaskGroup = {
            name: taskGroup?.name,
            tasks: [...taskGroup.tasks, newTask]
        };

        setContextData({task_groups: [...unchangedGroups, updatedGroup]});
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
            >
                <Form form={form}>
                    <Row>
                        <Col className={'edit-task__labels'}>
                            <span>Название задания</span>
                        </Col>
                        <Col flex={'auto'}>
                            <FormItem name={'taskName'}>
                                <Input type={'text'} placeholder={'Название задания'}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={'edit-task__labels'}>
                            <span>Текст задания</span>
                        </Col>
                        <Col flex={'auto'}>
                            <FormItem name={'taskText'}>
                                <TextArea placeholder={'Текст задания'} style={{resize: 'none', height: '320px'}}/>
                            </FormItem>
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
                                            <Form.Item label={`${index + 1}.`} key={field.key}>
                                                <Form.Item key={field.key} name={field.name}>
                                                    <Input
                                                        placeholder={'Введите подсказку'}
                                                        suffix={<DeleteOutlined onClick={() => remove(field.name)}/>}
                                                    />
                                                </Form.Item>
                                            </Form.Item>
                                        ))}
                                        <FormItem>
                                            <Button onClick={() => add()}>
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
                                        {fields.map((field, index) => (
                                            <Form.Item label={`${index + 1}.`} key={field.key}>
                                                <Form.Item key={field.key} name={field.name}>
                                                    <Input
                                                        placeholder={'Введите вариант ответа'}
                                                        suffix={<DeleteOutlined onClick={() => remove(field.name)}/>}
                                                    />
                                                </Form.Item>
                                            </Form.Item>
                                        ))}
                                        <FormItem>
                                            <Button onClick={() => add()}>
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
                                    min={1}
                                    style={{width: '128px', textAlignLast: 'center'}}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </ConfigProvider>
    );
}
