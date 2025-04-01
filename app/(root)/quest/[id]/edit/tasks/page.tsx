'use client';

import { useTasksContext } from '@/components/Tasks/ContextProvider/ContextProvider';
import QuestAdminTabs from '@/components/QuestAdmin/QuestAdminTabs';
import { TasksMode } from '@/components/Tasks/Task/Task.helpers';
import Tasks from '@/components/Tasks/Tasks';
import React, { useState } from 'react';
import { Button } from 'antd';
import classNames from 'classnames';
import { PlusOutlined } from '@ant-design/icons';
import { TaskGroupModalProps } from '@/components/Tasks/TaskGroup/EditTaskGroup/EditTaskGroup';

export default function TasksTab() {
    const { data: contextData } = useTasksContext()!;
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [EditTaskGroupComponent, setEditTaskGroupComponent] = useState<React.ComponentType<TaskGroupModalProps> | null>(null);

    const addTaskGroup = async () => {
        if (!EditTaskGroupComponent) {
            const DynamicEditTaskGroup = (await import('@/components/Tasks/TaskGroup/EditTaskGroup/EditTaskGroup')).default;
            setEditTaskGroupComponent(() => DynamicEditTaskGroup);
        }
        setIsOpenModal(true);
    };

    const addTaskGroupButton =
        <Button type={'primary'} className={classNames('quest-admin__extra-button', 'add-task-group__button')} onClick={addTaskGroup}>
            <PlusOutlined /> Добавить уровень
        </Button>;

    return (
        <QuestAdminTabs extraButton={addTaskGroupButton}>
            <Tasks mode={TasksMode.EDIT} props={contextData} />
            {EditTaskGroupComponent && isOpenModal && (
                <EditTaskGroupComponent
                    questId={contextData.quest.id}
                    isOpen={isOpenModal}
                    setIsOpen={setIsOpenModal}
                />
            )}
        </QuestAdminTabs>
    )
}