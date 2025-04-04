'use client';

import { Button, Popconfirm, UploadFile } from 'antd';
import {CopyOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {
    IBulkEditTaskGroups,
    ITask, ITaskDelete,
    ITaskGroup,
    ITaskGroupsAdminResponse,
    ITaskGroupsUpdate
} from '@/app/types/quest-interfaces';
import {useTasksContext} from "@/components/Tasks/ContextProvider/ContextProvider";
import {patchTaskGroups} from '@/app/api/api';
import { useSession } from 'next-auth/react';
import classNames from 'classnames';
import { TaskCreateModalProps } from '@/components/Tasks/Task/EditTask/EditTask';

interface TaskEditButtonsProps {
    questId: string,
    mobile526: boolean,
    taskGroupProps: Pick<ITaskGroup, 'id' | 'pub_time' | 'name'>
    task: ITask
}

export default function TaskEditButtons({questId, mobile526, taskGroupProps, task}: TaskEditButtonsProps) {
    const classname = mobile526 ? 'task-extra_small' : 'task-extra_large';
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [EditTaskComponent, setEditTaskComponent] = useState<React.ComponentType<TaskCreateModalProps> | null>(null);
    const {data: session} = useSession();

    const {data: contextData, updater: setContextData} = useTasksContext()!;
    const taskGroups = contextData.task_groups;
    const taskGroup = taskGroups
        .find(group => group.id === taskGroupProps.id && group.pub_time === taskGroupProps.pub_time)!;
    const taskGroupIndex = taskGroups.indexOf(taskGroup);

    const handleEditTask = async () => {
        // Динамически загружаем компонент только при первом открытии
        if (!EditTaskComponent) {
            const DynamicEditTask = (await import('@/components/Tasks/Task/EditTask/EditTask')).default;
            setEditTaskComponent(() => DynamicEditTask);
        }
        setIsOpenModal(true);
    };

    const handleDeleteTask = async () => {
        taskGroup.tasks = taskGroup.tasks.filter(item =>
            item.pub_time !== task.pub_time || item.id !== task.id);
        taskGroups[taskGroupIndex] = taskGroup;

        const deletedTask: ITaskDelete = {
            id: task.id!
        };

        const updateTaskGroup: ITaskGroupsUpdate = {
            id: taskGroup.id!,
            name: taskGroup.name,
            order_idx: taskGroup.order_idx!,
            pub_time: taskGroup.pub_time!,
            tasks: {
                delete: [deletedTask]
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
    };

    const handleCopyTask = async () => {
        const copiedTask: ITask = {
            correct_answers: task.correct_answers,
            hints_full: task.hints_full,
            name: task.name,
            question: task.question,
            reward: task.reward,
            verification: task.verification ?? 'auto',
            pub_time: new Date().toISOString()
        };

        if (task.media_links) {
            copiedTask.media_links = task.media_links;
        }

        taskGroup.tasks.push(copiedTask);
        taskGroups[taskGroupIndex] = taskGroup;

        const updateTaskGroup: ITaskGroupsUpdate = {
            id: taskGroup.id!,
            name: taskGroup.name,
            order_idx: taskGroup.order_idx!,
            pub_time: taskGroup.pub_time!,
            tasks: {
                create: [
                    {...copiedTask, group_id: taskGroup.id!, order_idx: taskGroup.tasks.length - 1}
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
    };

    return (
        <div className={classNames('task__edit-buttons', 'tasks__edit-buttons', classname)}>
            <Button onClick={handleEditTask} ghost>
                <EditOutlined/>
                <span className={'tasks__edit-buttons__text'}>Редактировать задачу</span>
            </Button>
            <Button onClick={handleCopyTask} ghost>
                <CopyOutlined/>
                <span className={'tasks__edit-buttons__text'}>Создать копию задачи</span>
            </Button>
            <Popconfirm
                placement="bottomRight"
                title="Удалить задачу?"
                onConfirm={handleDeleteTask}
                okText="Да"
                cancelText="Нет"
            >
                <Button danger>
                    <DeleteOutlined />
                    <span className={'tasks__edit-buttons__text'}>Удалить задачу</span>
                </Button>
            </Popconfirm>
            {EditTaskComponent && isOpenModal && (
                <EditTaskComponent
                    questId={questId}
                    isOpen={isOpenModal}
                    setIsOpen={setIsOpenModal}
                    taskGroupProps={taskGroupProps}
                    fileList={fileList}
                    setFileList={setFileList}
                    task={task}
                />
            )}
        </div>
    );
}