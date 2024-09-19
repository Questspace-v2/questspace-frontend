'use client';

import { Collapse, CollapseProps } from 'antd';
import Task from '@/components/Tasks/Task/Task';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { getTaskExtra, TasksMode } from '@/components/Tasks/Tasks.helpers';
import { ITaskGroup } from '@/app/types/quest-interfaces';
import TaskGroupExtra from '@/components/Tasks/TaskGroup/TaskGroupExtra/TaskGroupExtra';
import {useState} from "react";
import classNames from "classnames";
import { CheckCircleFilled } from '@ant-design/icons';

interface TaskGroupProps {
    mode: TasksMode,
    props: ITaskGroup,
    questId: string
}

export default function TaskGroup({mode, props, questId} : TaskGroupProps) {
    const { id, pub_time: pubTime, name, tasks } = props;
    const initialAcceptedTasks = tasks.filter(item => item.score > 0).length;
    const [acceptedTasks, setAcceptedTasks] = useState(initialAcceptedTasks);
    const totalScore = tasks.reduce((a, b) => a + b.score, 0);
    const isGroupClosed = acceptedTasks === tasks.length;
    const collapseExtra = mode === TasksMode.EDIT ?
        <TaskGroupExtra questId={questId} edit={mode === TasksMode.EDIT} taskGroupProps={{id, pub_time: pubTime, name}}/> :
        null;
    const totalScoreExtra = isGroupClosed ?
        <span className={'score'}>+{totalScore}</span> :
        null;

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: isGroupClosed ?
                <span className={'closed-group__title'}>
                    {name}
                    <CheckCircleFilled className={'green-check-circle'}/>
                </span> : name,
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
                                setAcceptedTasks={setAcceptedTasks}
                            />
                            {getTaskExtra(mode === TasksMode.EDIT, false, {id, pub_time: pubTime, name}, task, questId)}
                        </div>
                    ))}
                </>,
            headerClass: classNames(
                'task-group__name roboto-flex-header',
                isGroupClosed && 'closed-group'
            ),
            extra: collapseExtra ?? totalScoreExtra
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
