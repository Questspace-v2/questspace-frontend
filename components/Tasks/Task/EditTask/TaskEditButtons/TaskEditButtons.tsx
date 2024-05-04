'use client';

import {Button, ConfigProvider, UploadFile} from "antd";
import {blueOutlinedButton, redOutlinedButton} from "@/lib/theme/themeConfig";
import {CopyOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useState} from "react";
import EditTask from "@/components/Tasks/Task/EditTask/EditTask";

export default function TaskEditButtons({mobile526, taskGroupName}: {mobile526: boolean, taskGroupName: string}) {
    const classname = mobile526 ? 'task-extra_small' : 'task-extra_large';
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

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
            />
        </div>
    );
}