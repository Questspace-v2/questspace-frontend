'use client';

import React, {useState} from 'react';
import { Button, Dropdown, MenuProps, Popconfirm, UploadFile } from 'antd';
import { DeleteOutlined, EditOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import {useTasksContext} from '@/components/Tasks/ContextProvider/ContextProvider';
import {patchTaskGroups} from '@/app/api/api';
import { useSession } from 'next-auth/react';
import {IBulkEditTaskGroups, ITaskGroup, ITaskGroupsAdminResponse, ITaskGroupsDelete} from '@/app/types/quest-interfaces';
import classNames from 'classnames';

const DynamicEditTask = dynamic(() => import('@/components/Tasks/Task/EditTask/EditTask'),
    {ssr: false});
const DynamicEditTaskGroup = dynamic(() => import('@/components/Tasks/TaskGroup/EditTaskGroup/EditTaskGroup'),
    {ssr: false});

interface ITaskGroupExtra {
    questId: string,
    edit: boolean,
    taskGroupProps: Pick<ITaskGroup, 'id' | 'pub_time' | 'name' | 'description'>
}

export default function TaskGroupExtra({questId, edit, taskGroupProps}: ITaskGroupExtra) {
    const [open, setOpen] = useState(false);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const {data: session} = useSession();

    const {updater: setContextData} = useTasksContext()!;

    const handleMenuClick: MenuProps['onClick'] = (menu) => {
        console.log(menu?.key === '3')
        if (menu?.key !== '3') {
            setOpen(false);
        }
    };

    const handleOpenChange = (flag: boolean, info: { source: 'trigger' | 'menu'}) => {
        if (info?.source === 'trigger') {
            setOpen(flag);
        }
    };

    const handleEditTaskGroup = () => {
        setIsOpenEditModal(true);
    };

    const handleAddTask = () => {
        setIsOpenCreateModal(true);
    };

    const handleDeleteGroup = async () => {
        const deletedTaskGroup: ITaskGroupsDelete = {
            id: taskGroupProps.id!
        };

        const requestData: IBulkEditTaskGroups = {
            delete: [deletedTaskGroup]
        };

        const data = await patchTaskGroups(
            questId, requestData, session?.accessToken
        ) as ITaskGroupsAdminResponse;

        setContextData((prevContextData) => ({
            ...prevContextData,
            task_groups: data.task_groups,
        }));
    };

    const items: MenuProps['items'] = [
        {
            label: <><EditOutlined/>Редактировать</>,
            key: '1',
            onClick: handleEditTaskGroup,
        },
        {

            label: <><PlusOutlined/>Добавить задачу</>,
            key: '2',
            onClick: handleAddTask,
        },
        {
            label:
                <Popconfirm
                    placement="bottomRight"
                    title="Удалить уровень?"
                    onConfirm={async () => {
                        setOpen(false)
                        await handleDeleteGroup()
                    }}
                    onCancel={() => setOpen(false)}
                    okText="Да"
                    cancelText="Нет"
                >
                    <><DeleteOutlined/>Удалить уровень</>
                </Popconfirm>,
            key: '3',
            // onClick: () => setOpen(true)
        },
    ];

    if (!edit) {
        return null;
    }

    return (
        <div className={classNames('task-group__collapse-buttons', 'tasks__collapse-buttons')}>
            <Button onClick={handleEditTaskGroup} ghost><EditOutlined/>Редактировать</Button>
            <Button onClick={handleAddTask} ghost><PlusOutlined/>Добавить задачу</Button>
            <Popconfirm
                placement="bottomRight"
                title="Удалить уровень?"
                onConfirm={handleDeleteGroup}
                okText="Да"
                cancelText="Нет"
            >
                <Button danger><DeleteOutlined/></Button>
            </Popconfirm>
            <Dropdown
                rootClassName={'task-group-extra__dropdown'}
                className={'task-group-extra__burger-button'}
                menu={{
                    items,
                    onClick: (menu) => handleMenuClick(menu),
                }}
                onOpenChange={(op, info) => handleOpenChange(op, info)}
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
                isOpen={isOpenEditModal}
                setIsOpen={setIsOpenEditModal}
            />
        </div>
    );
}
