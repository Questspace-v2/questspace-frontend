'use client';

import { Button, Col, Form, Input, Row } from 'antd';
import React, {Dispatch, SetStateAction, useState} from 'react';
import { useTasksContext } from '@/components/Tasks/ContextProvider/ContextProvider';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import {ValidationStatus} from "@/lib/utils/modalTypes";
import {useSession} from "next-auth/react";
import {patchTaskGroups} from "@/app/api/api";
import {
    IBulkEditTaskGroups,
    ITaskGroup,
    ITaskGroupsAdminResponse,
    ITaskGroupsCreate,
    ITaskGroupsUpdate
} from '@/app/types/quest-interfaces';
import CustomModal, { customModalClassname } from '@/components/CustomModal/CustomModal';
import classNames from 'classnames';

const {TextArea} = Input;

interface TaskGroupModalProps {
    questId: string;
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    taskGroupProps?: Pick<ITaskGroup, 'id' | 'pub_time' | 'name' | 'description'>
}

export interface TaskGroupForm {
    groupName: string,
    description?: string
}

export default function EditTaskGroup({questId, isOpen, setIsOpen, taskGroupProps}: TaskGroupModalProps) {
    const {xs, md} = useBreakpoint();
    const [form] = Form.useForm<TaskGroupForm>();

    const {data: contextData, updater: setContextData} = useTasksContext()!;
    const title = taskGroupProps ? 'Настройки уровня' : 'Создание уровня';

    const [validationStatus, setValidationStatus] = useState<ValidationStatus>('success');
    const [errorMsg, setErrorMsg] = useState<string>('');

    const {data: session} = useSession();

    const handleFieldChange = () => {
        setErrorMsg('');
        setValidationStatus('success');
    };

    const handleSave = async () => {
        const taskGroups = contextData.task_groups ?? [];
        const currentTaskGroup = taskGroups.find(item => item.id === taskGroupProps?.id && item.pub_time === taskGroupProps?.pub_time)!;
        const taskGroupIndex = taskGroups.indexOf(currentTaskGroup);
        const groupName = form.getFieldValue('groupName') as string;
        const description = form.getFieldValue('description') as string;

        if (!groupName) {
            setValidationStatus('error');
            setErrorMsg('Название не должно быть пустой строкой');
            return;
        }

        if (taskGroupProps) {
            const taskGroup = taskGroups[taskGroupIndex];
            taskGroups[taskGroupIndex].name = groupName;
            taskGroups[taskGroupIndex].description = description;
            setIsOpen(false);

            const updateTaskGroup: ITaskGroupsUpdate = {
                ...taskGroup,
                id: taskGroup.id!,
                pub_time: taskGroup.pub_time!,
                name: groupName,
                description,
                order_idx: taskGroupIndex,
                tasks: {}
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
            return;
        }

        const pubTime = new Date();
        taskGroups.push({name: groupName, description, tasks: [], pub_time: pubTime.toISOString()});

        const newGroup: ITaskGroupsCreate = {
            name: groupName,
            description,
            tasks: [],
            pub_time: pubTime.toISOString(),
            order_idx: taskGroups.length - 1,
        };

        const requestData: IBulkEditTaskGroups = {
            create: [newGroup]
        };

        const data = await patchTaskGroups(
            questId, requestData, session?.accessToken
        ) as ITaskGroupsAdminResponse;

        setContextData({
            ...contextData,
            task_groups: data.task_groups,
        });
        setIsOpen(false);
    };

    const onCancel = () => {
        setErrorMsg('');
        setValidationStatus('success');
        setIsOpen(false);
    }

    return (
        <CustomModal
            className={'edit-task-group__modal'}
            classNames={{content: 'edit-task-group__content'}}
            open={isOpen}
            width={xs ?? md ? '100%': 800}
            centered
            destroyOnClose
            title={<h3 className={classNames(`${customModalClassname}-header`, 'roboto-flex-header')}>{title}</h3>}
            onCancel={onCancel}
            footer={[
                <Button key={'save'} type={'primary'} onClick={handleSave}>
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
                autoComplete={'off'}
                preserve={false}
                initialValues={{
                    groupName: taskGroupProps?.name,
                    description: taskGroupProps?.description
                }}
                noValidate
            >
                <Row>
                    <Col className={'edit-task-group__labels'}>
                        <span>Название уровня</span>
                    </Col>
                    <Col flex={'auto'}>
                        <Form.Item<TaskGroupForm>
                            name={'groupName'}
                            validateStatus={validationStatus}
                            help={errorMsg}
                        >
                            <Input
                                type={'text'}
                                onChange={handleFieldChange}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col className={'edit-task-group__labels'}>
                        <span>Описание <span className={'light-description'}>поддерживает&nbsp;Markdown</span></span>
                    </Col>
                    <Col flex={'auto'}>
                        <Form.Item<TaskGroupForm>
                            name={'description'}
                            colon={false}
                        >
                            <TextArea
                                style={{ resize: 'none', height: '320px' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </CustomModal>
    );
}
