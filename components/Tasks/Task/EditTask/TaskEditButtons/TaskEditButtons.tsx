'use client';

import {Button, ConfigProvider, Form, UploadFile} from "antd";
import {blueOutlinedButton, redOutlinedButton} from "@/lib/theme/themeConfig";
import {CopyOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import EditTask, {TaskForm} from "@/components/Tasks/Task/EditTask/EditTask";
import {ITask} from "@/app/types/quest-interfaces";

interface TaskEditButtonsProps {
    mobile526: boolean,
    taskGroupName: string,
    task: ITask
}

export default function TaskEditButtons({mobile526, taskGroupName, task}: TaskEditButtonsProps) {
    const classname = mobile526 ? 'task-extra_small' : 'task-extra_large';
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm<TaskForm>();

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

    const handleEditTask = () => {
        setIsOpenModal(true);
    };

    const handleDeleteTask = async () => {

    };

    const handleCopyTask = () => {

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
            <EditTask
                isOpen={isOpenModal}
                setIsOpen={setIsOpenModal}
                taskGroupName={taskGroupName}
                fileList={fileList}
                setFileList={setFileList}
                form={form}
                task={task}
            />
        </div>
    );
}