'use client';

import {Button, ConfigProvider, UploadFile} from "antd";
import {blueOutlinedButton, redOutlinedButton} from "@/lib/theme/themeConfig";
import {CopyOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useState} from "react";
import {ITask} from "@/app/types/quest-interfaces";
import {useTasksContext} from "@/components/Tasks/ContextProvider/ContextProvider";
import dynamic from "next/dynamic";

interface TaskEditButtonsProps {
    questId: string,
    mobile526: boolean,
    taskGroupName: string,
    task: ITask
}

const DynamicEditTask = dynamic(() => import('@/components/Tasks/Task/EditTask/EditTask'),
    {ssr: false});

export default function TaskEditButtons({questId, mobile526, taskGroupName, task}: TaskEditButtonsProps) {
    const classname = mobile526 ? 'task-extra_small' : 'task-extra_large';
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const {data: contextData, updater: setContextData} = useTasksContext()!;
    const taskGroups = contextData.task_groups;
    const taskGroup = taskGroups
        .find(group => group.name === taskGroupName)!;
    const taskGroupIndex = taskGroups.indexOf(taskGroup);

    const handleEditTask = () => {
        setIsOpenModal(true);
    };

    const handleDeleteTask = () => {
        taskGroup.tasks = taskGroup.tasks.filter(item =>
            item.pub_time !== task.pub_time || item.id !== task.id);
        taskGroups[taskGroupIndex] = taskGroup;
        setContextData(prevState => ({
            task_groups: prevState.task_groups
                .map((item, index) => index === taskGroupIndex ? taskGroup : item)
        }));
    };

    const handleCopyTask = () => {
        const copiedTask: ITask = {
            ...task,
            pub_time: new Date().toISOString()
        };
        taskGroup.tasks.push(copiedTask);
        taskGroups[taskGroupIndex] = taskGroup;
        setContextData(prevState => ({
            ...prevState,
            task_groups: taskGroups
        }));
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
                taskGroupName={taskGroupName}
                fileList={fileList}
                setFileList={setFileList}
                task={task}
            />
        </div>
    );
}