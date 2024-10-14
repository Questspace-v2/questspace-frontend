'use client';

import { Collapse, CollapseProps } from 'antd';
import Task from '@/components/Tasks/Task/Task';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { getTaskExtra, TasksMode } from '@/components/Tasks/Task/Task.helpers';
import { ITaskGroup } from '@/app/types/quest-interfaces';
import TaskGroupExtra from '@/components/Tasks/TaskGroup/TaskGroupExtra/TaskGroupExtra';
import classNames from 'classnames';
import {useTasksContext} from '@/components/Tasks/ContextProvider/ContextProvider';

interface TaskGroupProps {
    mode: TasksMode,
    props: ITaskGroup,
    questId: string
}

export default function TaskGroup({mode, props, questId} : TaskGroupProps) {
    const { id, pub_time: pubTime, name } = props;
    const {data: contextData} = useTasksContext()!;
    const tasks = contextData.task_groups.find(item => item.id === id)?.tasks ?? [];
    const totalScore = tasks.reduce((a, b) => a + b.reward, 0);
    const isGroupClosed = tasks.length > 0 && tasks
        .every(item => item.score !== undefined && (item.score > 0 || mode === TasksMode.EDIT));
    const collapseExtra = mode === TasksMode.EDIT ?
        <TaskGroupExtra questId={questId} edit={mode === TasksMode.EDIT} taskGroupProps={{id, pub_time: pubTime, name}}/> :
        null;
    const totalScoreExtra = isGroupClosed ?
        <span className={'task-group__score'}>+{totalScore}</span> :
        null;
    const label = <div className='task-group__name-with-score'>
        <span>{name}</span>
        {totalScoreExtra}
    </div>

    const items: CollapseProps['items'] = [
        {
            key: id,
            label,
            children: tasks &&
                <>
                    {(tasks.map((task) =>
                        <div className={'task-group__task'} key={task.pub_time + task.id}>
                            <Task
                                props={task}
                                mode={mode}
                                questId={questId}
                                taskGroupProps={{id, pub_time: pubTime, name}}
                                key={task.pub_time + task.id}
                            />
                            {getTaskExtra(mode === TasksMode.EDIT, false, {id, pub_time: pubTime, name}, task, questId)}
                        </div>
                    ))}
                </>,
            headerClass: classNames(
                'tasks__name',
                'task-group__name',
                'roboto-flex-header',
                isGroupClosed && 'closed-group'
            ),
            extra: collapseExtra
        },
    ];

    return (
        <ContentWrapper className={'tasks__content-wrapper'}>
            <Collapse
                ghost
                items={items}
                className={classNames('task-group__collapse', 'tasks__collapse')}
                collapsible={'header'}
                defaultActiveKey={mode === TasksMode.EDIT ? id : undefined}
            />
        </ContentWrapper>
    );
}
