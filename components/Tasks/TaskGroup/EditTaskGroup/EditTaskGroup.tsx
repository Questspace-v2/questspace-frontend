'use client';

import { Button, Checkbox, Col, Form, Input, InputNumber, Row } from 'antd';
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
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

const {TextArea} = Input;

export interface TaskGroupModalProps {
    questId: string;
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    taskGroupProps?: Pick<ITaskGroup, 'id' | 'pub_time' | 'name' | 'description'>
}

export interface TaskGroupForm {
    groupName: string,
    description?: string,
    timeLimit?: number,
}

export default function EditTaskGroup({questId, isOpen, setIsOpen, taskGroupProps}: TaskGroupModalProps) {
    const {xs, md} = useBreakpoint();
    const [form] = Form.useForm<TaskGroupForm>();

    const {data: contextData, updater: setContextData} = useTasksContext()!;
    const taskGroups = contextData.task_groups ?? [];
    const isLinear = contextData.quest.quest_type === 'LINEAR';
    const currentTaskGroup = taskGroups.find(item => item.id === taskGroupProps?.id && item.pub_time === taskGroupProps?.pub_time)!;
    const [noTimeLimit, setNoTimeLimit] = useState<boolean>(!isLinear || currentTaskGroup && !currentTaskGroup?.has_time_limit || currentTaskGroup?.time_limit === null);
    const [timeLimit, setTimeLimit] = useState(currentTaskGroup?.has_time_limit && currentTaskGroup?.time_limit ? currentTaskGroup.time_limit / 60 : 3);
    const title = taskGroupProps ? 'Настройки уровня' : 'Создание уровня';

    const [validationStatus, setValidationStatus] = useState<ValidationStatus>('success');
    const [errorMsg, setErrorMsg] = useState<string>('');

    const {data: session} = useSession();

    const handleFieldChange = () => {
        setErrorMsg('');
        setValidationStatus('success');
    };

    const handleSave = async () => {
        const taskGroupIndex = taskGroups.indexOf(currentTaskGroup);
        const groupName = form.getFieldValue('groupName') as string;
        const description = form.getFieldValue('description') as string;
        const finalTimeLimit = !isLinear || noTimeLimit ? null : timeLimit * 60;

        if (!groupName) {
            setValidationStatus('error');
            setErrorMsg('Название не должно быть пустой строкой');
            return;
        }

        if (currentTaskGroup) {
            currentTaskGroup.name = groupName;
            currentTaskGroup.description = description;
            setIsOpen(false);

            const updateTaskGroup: ITaskGroupsUpdate = {
                ...currentTaskGroup,
                id: currentTaskGroup.id!,
                pub_time: currentTaskGroup.pub_time!,
                name: groupName,
                description,
                order_idx: taskGroupIndex,
                has_time_limit: !noTimeLimit,
                time_limit: finalTimeLimit,
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
        taskGroups.push({
            name: groupName,
            description,
            tasks: [],
            pub_time: pubTime.toISOString(),
            ...(isLinear) && {
                has_time_limit: !noTimeLimit,
                time_limit: finalTimeLimit
            },
        });

        const newGroup: ITaskGroupsCreate = {
            name: groupName,
            description,
            tasks: [],
            pub_time: pubTime.toISOString(),
            ...(isLinear) && {
                has_time_limit: !noTimeLimit,
                time_limit: finalTimeLimit
            },
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
        form.resetFields();
    };

    const onCancel = () => {
        form.resetFields();
        setErrorMsg('');
        setValidationStatus('success');
        setIsOpen(false);
    }

    return (
        <CustomModal
            className={'edit-task-group__modal'}
            classNames={{ content: 'edit-task-group__content' }}
            open={isOpen}
            width={xs ?? md ? '100%' : 800}
            centered
            destroyOnClose
            title={
                <h3
                    className={classNames(
                        `${customModalClassname}-header`,
                        'roboto-flex-header',
                    )}
                >
                    {title}
                </h3>
            }
            onCancel={onCancel}
            footer={[
                <Button key={'save'} type={'primary'} onClick={handleSave}>
                    Сохранить изменения
                </Button>,
                <Button key={'cancel'} onClick={onCancel}>
                    Отменить
                </Button>,
            ]}
            forceRender
        >
            <Form
                form={form}
                autoComplete={'off'}
                preserve={false}
                onKeyDown={(e) => e.stopPropagation()}
                initialValues={{
                    groupName: currentTaskGroup?.name,
                    description: currentTaskGroup?.description,
                    timeLimit: currentTaskGroup?.time_limit ? currentTaskGroup.time_limit / 60 : 3,
                }}
                fields={[
                    { name: 'timeLimit', value: timeLimit },
                ]}
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
                            <Input type={'text'} onChange={handleFieldChange} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col className={'edit-task-group__labels'}>
                        <span>
                            Описание{' '}
                            <span className={'light-description'}>
                                поддерживает&nbsp;Markdown
                            </span>
                        </span>
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
                <Row>
                    <Col className={'edit-task-group__labels'}>
                        <span
                            className={classNames(
                                !isLinear && 'text-disabled',
                            )}
                        >
                            Время на прохождение
                        </span>
                    </Col>
                    <Col flex={'auto'}>
                        <Form.Item<TaskGroupForm>
                            // name={'timeLimit'}
                            colon={false}
                            extra={
                                <Checkbox
                                    checked={noTimeLimit}
                                    disabled={!isLinear}
                                    onClick={() => setNoTimeLimit((prev) => !prev)}
                                    style={{ padding: '5px 0' }}
                                >
                                    Без ограничений
                                </Checkbox>
                            }
                        >
                            <InputNumber
                            name="timeLimit"
                            addonBefore={
                                <MinusOutlined
                                    onClick={() => {
                                        if (!noTimeLimit && timeLimit > 1) {
                                            setTimeLimit((prev) => prev - 1);
                                        }
                                    }}
                                />}
                            addonAfter={
                                <PlusOutlined
                                    onClick={() => {
                                        if (!noTimeLimit) {
                                            setTimeLimit((prev) => prev + 1);
                                        }
                                    }}
                                />}
                            controls={false}
                            disabled={!isLinear || noTimeLimit}
                            min={1}
                            style={{ width: '128px', textAlignLast: 'center' }}
                            onChange={(value) => {
                                setTimeLimit(value ?? 1);
                            }}
                            value={timeLimit}
                        />
                        <span
                            className={classNames(
                                !isLinear && 'text-disabled',
                            )}
                        >
                            минут
                        </span>
                        </Form.Item>
                        {isLinear ? (
                            <span className={'text-secondary'}>
                        Если ограничить время на прохождение, то после
                        указанного времени уровень заблокируется и прием задач
                        на уровне закроется
                        </span>
                        ) : (
                            <span className={'text-secondary'}>
                                Чтобы ограничивать время на прохождения уровня,
                                выберите порядок выдачи заданий «Линейка»
                                в настройках квеста
                            </span>
                        )}
                    </Col>
                </Row>
            </Form>
        </CustomModal>
    );
}
