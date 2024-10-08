'use client';

import { Collapse, CollapseProps } from 'antd';
import Task from '@/components/Tasks/Task/Task';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { getTaskExtra, TasksMode } from '@/components/Tasks/Task/Task.helpers';
import { ITaskGroup } from '@/app/types/quest-interfaces';
import TaskGroupExtra from '@/components/Tasks/TaskGroup/TaskGroupExtra/TaskGroupExtra';
import classNames from 'classnames';
import {useTasksContext} from '@/components/Tasks/ContextProvider/ContextProvider';
import {RELEASED_FEATURE} from '@/app/api/client/constants';

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
    const isGroupClosed = tasks.every(item => item.score && item.score > 0);
    const collapseExtra = mode === TasksMode.EDIT ?
        <TaskGroupExtra questId={questId} edit={mode === TasksMode.EDIT} taskGroupProps={{id, pub_time: pubTime, name}}/> :
        null;
    const totalScoreExtra = isGroupClosed && RELEASED_FEATURE ?
        <span className={'task-group__score'}>+{totalScore}</span> :
        null;

    const items: CollapseProps['items'] = [
        {
            key: id,
            label: name,
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
                isGroupClosed && RELEASED_FEATURE && 'closed-group'
            ),
            extra: collapseExtra ?? totalScoreExtra
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
