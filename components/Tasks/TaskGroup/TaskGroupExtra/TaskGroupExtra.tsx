'use client';

import React, {useState} from 'react';
import {Button, Dropdown, MenuProps, UploadFile} from 'antd';
import { DeleteOutlined, EditOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import {useTasksContext} from '@/components/Tasks/ContextProvider/ContextProvider';
import {patchTaskGroups} from '@/app/api/api';
import { useSession } from 'next-auth/react';
import {IQuestTaskGroups, ITaskGroup, ITaskGroupsAdminResponse, ITaskGroupsDelete} from '@/app/types/quest-interfaces';

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

    const {updater: setContextData} = useTasksContext()!;

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
        const deletedTaskGroup: ITaskGroupsDelete = {
            id: taskGroupProps.id!
        };

        const requestData: IQuestTaskGroups = {
            delete: [deletedTaskGroup]
        };

        const data = await patchTaskGroups(
            questId, requestData, session?.accessToken
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
                <Button onClick={handleChangeName} ghost><EditOutlined/>Изменить название</Button>
                <Button onClick={handleAddTask} ghost><PlusOutlined/>Добавить задачу</Button>
                <Button onClick={handleDeleteGroup} danger><DeleteOutlined/></Button>
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
