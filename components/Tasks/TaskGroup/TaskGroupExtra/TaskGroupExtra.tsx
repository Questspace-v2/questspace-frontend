'use client';

import React, { useState } from 'react';
import { Button, ConfigProvider, Dropdown, MenuProps } from 'antd';
import { blueOutlinedButton, redOutlinedButton } from '@/lib/theme/themeConfig';
import { DeleteOutlined, EditOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';

const DynamicEditTask = dynamic(() => import('@/components/Tasks/Task/EditTask/EditTask'),
    {ssr: false})

export default function TaskGroupExtra({edit, taskGroupName}: {edit: boolean, taskGroupName: string}) {
    // const {data: contextData, updater: setContextData} = useTasksContext()!;
    const [open, setOpen] = useState(false);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);

    const handleMenuClick: MenuProps['onClick'] = () => {
        setOpen(false);
    };

    const handleOpenChange = (flag: boolean) => {
        setOpen(flag);
    };

    const handleAddTask = () => {
        setIsOpenCreateModal(true);
        // setContextData({task_groups: contextData.task_groups});
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

            label: <><DeleteOutlined/>Удалить раздел</>,
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
                    <Button><DeleteOutlined/>Удалить раздел</Button>
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
                    fileList={[]}
                />
            </div>
        );
    }

    return null;
}
