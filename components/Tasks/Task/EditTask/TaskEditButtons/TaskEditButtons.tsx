'use client';

import {Button, ConfigProvider, UploadFile} from "antd";
import {blueOutlinedButton, redOutlinedButton} from "@/lib/theme/themeConfig";
import {CopyOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useState} from "react";
import {ITask, ITaskGroup, ITaskGroupsAdminResponse} from '@/app/types/quest-interfaces';
import {useTasksContext} from "@/components/Tasks/ContextProvider/ContextProvider";
import dynamic from "next/dynamic";
import { createTaskGroupsAndTasks } from '@/app/api/api';
import { useSession } from 'next-auth/react';

interface TaskEditButtonsProps {
    questId: string,
    mobile526: boolean,
    taskGroupProps: Pick<ITaskGroup, 'id' | 'pub_time' | 'name'>
    task: ITask
}

const DynamicEditTask = dynamic(() => import('@/components/Tasks/Task/EditTask/EditTask'),
    {ssr: false});

export default function TaskEditButtons({questId, mobile526, taskGroupProps, task}: TaskEditButtonsProps) {
    const classname = mobile526 ? 'task-extra_small' : 'task-extra_large';
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const {data: session} = useSession();

    const {data: contextData, updater: setContextData} = useTasksContext()!;
    const taskGroups = contextData.task_groups;
    const taskGroup = taskGroups
        .find(group => group.id === taskGroupProps.id && group.pub_time === taskGroupProps.pub_time)!;
    const taskGroupIndex = taskGroups.indexOf(taskGroup);

    const handleEditTask = () => {
        setIsOpenModal(true);
    };

    const handleDeleteTask = async () => {
        taskGroup.tasks = taskGroup.tasks.filter(item =>
            item.pub_time !== task.pub_time || item.id !== task.id);
        taskGroups[taskGroupIndex] = taskGroup;

        const data = await createTaskGroupsAndTasks(
            questId, {task_groups: taskGroups}, session?.accessToken
        ) as ITaskGroupsAdminResponse;

        setContextData({
            task_groups: data.task_groups,
        });
    };

    const handleCopyTask = async () => {
        const copiedTask: ITask = {
            ...task,
            pub_time: new Date().toISOString()
        };
        taskGroup.tasks.push(copiedTask);
        taskGroups[taskGroupIndex] = taskGroup;

        const data = await createTaskGroupsAndTasks(
            questId, {task_groups: taskGroups}, session?.accessToken
        ) as ITaskGroupsAdminResponse;

        setContextData({
            task_groups: data.task_groups,
        });
    };

    return (
        <div className={`task__edit-buttons ${classname}`}>
            <ConfigProvider theme={blueOutlinedButton}>
                <Button onClick={handleEditTask}><EditOutlined/>{!mobile526 && 'Редактировать задачу'}</Button>
                <Button onClick={handleCopyTask}><CopyOutlined/>{!mobile526 && 'Создать копию задачи'}</Button>
            </ConfigProvider>
            <ConfigProvider theme={redOutlinedButton}>
                <Button onClick={handleDeleteTask}><DeleteOutlined/>{!mobile526 && 'Удалить задачу'}</Button>
            </ConfigProvider>
            <DynamicEditTask
                questId={questId}
                isOpen={isOpenModal}
                setIsOpen={setIsOpenModal}
                taskGroupProps={taskGroupProps}
                fileList={fileList}
                setFileList={setFileList}
                task={task}
            />
        </div>
    );
}
