'use client';

import { Collapse, CollapseProps } from 'antd';
import Task from '@/components/Tasks/Task/Task';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { getTaskExtra, TasksMode } from '@/components/Tasks/Tasks.helpers';
import { ITaskGroup } from '@/app/types/quest-interfaces';
import TaskGroupExtra from '@/components/Tasks/TaskGroup/TaskGroupExtra/TaskGroupExtra';

import './TaskGroup.css';

interface TaskGroupProps {
    mode: TasksMode,
    props: ITaskGroup,
    questId: string
}

export default function TaskGroup({mode, props, questId} : TaskGroupProps) {
    const { name, tasks } = props;
    const collapseExtra = mode === TasksMode.EDIT ?
        <TaskGroupExtra edit={mode === TasksMode.EDIT} taskGroupName={name}/> :
        null;

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: name,
            children: tasks &&
                <>
                    {(tasks.map((task) =>
                        <div className={'task-group__task'} key={task.pub_time + task.id}>
                            <Task props={task} mode={mode} questId={questId} taskGroupName={name} key={task.pub_time + task.id}/>
                            {getTaskExtra(mode === TasksMode.EDIT, false, name, task)}
                        </div>
                    ))}
                </>,
            headerClass: 'task-group__name roboto-flex-header',
            extra: collapseExtra
        },
    ];

    return (
        <ContentWrapper className={'task-group__content-wrapper'}>
            <Collapse
                ghost
                items={items}
                className={'task-group__collapse'}
                collapsible={'header'}
                defaultActiveKey={mode === TasksMode.EDIT ? '1' : undefined}
            />
        </ContentWrapper>
    );
}
