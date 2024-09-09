'use client';

import React, {useState} from 'react';
import {Button, ConfigProvider, Dropdown, MenuProps, UploadFile} from 'antd';
import { blueOutlinedButton, redOutlinedButton } from '@/lib/theme/themeConfig';
import { DeleteOutlined, EditOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import {useTasksContext} from '@/components/Tasks/ContextProvider/ContextProvider';
import { createTaskGroupsAndTasks } from '@/app/api/api';
import { useSession } from 'next-auth/react';
import {ITaskGroup, ITaskGroupsAdminResponse} from '@/app/types/quest-interfaces';

const DynamicEditTask = dynamic(() => import('@/components/Tasks/Task/EditTask/EditTask'),
    {ssr: false});
const DynamicEditTaskGroup = dynamic(() => import('@/components/Tasks/TaskGroup/EditTaskGroup/EditTaskGroup'),
    {ssr: false});

interface ITaskGroupExtra {
    questId: string,
    edit: boolean,
    taskGroupProps: Pick<ITaskGroup, 'id' | 'pub_time' | 'name'>
}

export default function TaskGroupExtra({questId, edit, taskGroupProps}: ITaskGroupExtra) {
    const [open, setOpen] = useState(false);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isOpenNameModal, setIsOpenNameModal] = useState(false);
    const {data: session} = useSession();

    const {data: contextData, updater: setContextData} = useTasksContext()!;

    const handleMenuClick: MenuProps['onClick'] = () => {
        setOpen(false);
    };

    const handleOpenChange = (flag: boolean) => {
        setOpen(flag);
    };

    const handleChangeName = () => {
        setIsOpenNameModal(true);
    };

    const handleAddTask = () => {
        setIsOpenCreateModal(true);
    };

    const handleDeleteGroup = async () => {
        const newTaskGroups = contextData.task_groups.filter(
            group => group.id !== taskGroupProps.id || group.pub_time !== taskGroupProps.pub_time
        );

        const data = await createTaskGroupsAndTasks(
            questId, {task_groups: newTaskGroups}, session?.accessToken
        ) as ITaskGroupsAdminResponse;

        setContextData({
            task_groups: data.task_groups,
        });
    };

    const items: MenuProps['items'] = [
        {
            label: <><EditOutlined/>Изменить название</>,
            key: '1',
            onClick: handleChangeName,
        },
        {

            label: <><PlusOutlined/>Добавить задачу</>,
            key: '2',
            onClick: handleAddTask,
        },
        {

            label: <><DeleteOutlined/>Удалить раздел</>,
            key: '3',
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick: handleDeleteGroup
        },
    ];

    if (!edit) {
        return null;
    }

    return (
        <div className={'task-group__collapse-buttons'}>
            <ConfigProvider theme={blueOutlinedButton}>
                <Button onClick={handleChangeName}><EditOutlined/>Изменить название</Button>
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
                trigger={['click']}
            >
                <Button><MenuOutlined/></Button>
            </Dropdown>
            <DynamicEditTask
                questId={questId}
                isOpen={isOpenCreateModal}
                setIsOpen={setIsOpenCreateModal}
                taskGroupProps={taskGroupProps}
                fileList={fileList}
                setFileList={setFileList}
            />
            <DynamicEditTaskGroup
                questId={questId}
                taskGroupProps={taskGroupProps}
                isOpen={isOpenNameModal}
                setIsOpen={setIsOpenNameModal}
            />
        </div>
    );
}
