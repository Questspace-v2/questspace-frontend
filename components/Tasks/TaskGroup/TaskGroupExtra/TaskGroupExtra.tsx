'use client';

import React, {useState} from 'react';
import {Button, ConfigProvider, Dropdown, Form, MenuProps, UploadFile} from 'antd';
import { blueOutlinedButton, redOutlinedButton } from '@/lib/theme/themeConfig';
import { DeleteOutlined, EditOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import {TaskForm} from "@/components/Tasks/Task/EditTask/EditTask";
import {useTasksContext} from "@/components/Tasks/ContextProvider/ContextProvider";

const DynamicEditTask = dynamic(() => import('@/components/Tasks/Task/EditTask/EditTask'),
    {ssr: false})

export default function TaskGroupExtra({edit, taskGroupName}: {edit: boolean, taskGroupName: string}) {
    const [open, setOpen] = useState(false);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm<TaskForm>();

    const {data: contextData, updater: setContextData} = useTasksContext()!;

    const handleMenuClick: MenuProps['onClick'] = () => {
        setOpen(false);
    };

    const handleOpenChange = (flag: boolean) => {
        setOpen(flag);
    };

    const handleAddTask = () => {
        setIsOpenCreateModal(true);
    };

    const handleDeleteGroup = () => {
        setContextData({task_groups: contextData.task_groups.filter(group => group.name !== taskGroupName)});
    };

    const items: MenuProps['items'] = [
        {
            label: <><EditOutlined/>Изменить название</>,
            key: '1',
        },
        {

            label: <><PlusOutlined/>Добавить задачу</>,
            key: '2',
            onClick: handleAddTask,
        },
        {

            label: <><DeleteOutlined onClick={handleDeleteGroup}/>Удалить раздел</>,
            key: '3',
        },
    ];

    if (edit) {
        return (
            <div className={'task-group__collapse-buttons'}>
                <ConfigProvider theme={blueOutlinedButton}>
                    <Button><EditOutlined/>Изменить название</Button>
                    <Button onClick={handleAddTask}><PlusOutlined/>Добавить задачу</Button>
                </ConfigProvider>
                <ConfigProvider theme={redOutlinedButton}>
                    <Button onClick={handleDeleteGroup}><DeleteOutlined/>Удалить раздел</Button>
                </ConfigProvider>
                <Dropdown
                    rootClassName={'task-group-extra__dropdown'}
                    className={'task-group-extra__burger-button'}
                    menu={{
                        items,
                        onClick: handleMenuClick,
                    }}
                    onOpenChange={handleOpenChange}
                    open={open}
                    placement={'bottomRight'}
                    destroyPopupOnHide
                >
                    <Button><MenuOutlined/></Button>
                </Dropdown>
                <DynamicEditTask
                    isOpen={isOpenCreateModal}
                    setIsOpen={setIsOpenCreateModal}
                    taskGroupName={taskGroupName}
                    fileList={fileList}
                    setFileList={setFileList}
                    form={form}
                />
            </div>
        );
    }

    return null;
}
