'use client';

import { Button, Collapse, CollapseProps } from 'antd';
import Task from '@/components/Tasks/Task/Task';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { getTaskExtra, TasksMode } from '@/components/Tasks/Task/Task.helpers';
import { ITaskGroup } from '@/app/types/quest-interfaces';
import TaskGroupExtra from '@/components/Tasks/TaskGroup/TaskGroupExtra/TaskGroupExtra';
import classNames from 'classnames';
import {useTasksContext} from '@/components/Tasks/ContextProvider/ContextProvider';
import remarkGfm from 'remark-gfm';
import Markdown from 'react-markdown';
import React, { useState } from 'react';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

interface TaskGroupProps {
    mode: TasksMode,
    props: ITaskGroup,
    questId: string
}

export default function TaskGroup({mode, props, questId} : TaskGroupProps) {
    const { id, pub_time: pubTime, name, description } = props;
    const {data: contextData} = useTasksContext()!;
    const [showSolvedTasks, setShowSolvedTasks] = useState<boolean>(false);
    const tasks = contextData.task_groups.find(item => item.id === id)?.tasks ?? [];
    const solvedTasksFirst = tasks.sort((a, b) => +!!b.score - +!!a.score);
    const totalScore = tasks.reduce((a, b) => a + (b.score ?? 0), 0);
    const isEditMode = mode === TasksMode.EDIT;
    const isGroupClosed = tasks.length > 0 && tasks
        .every(item => item.score !== undefined && (item.score > 0 || isEditMode));
    const collapseExtra = isEditMode ?
        <TaskGroupExtra questId={questId} edit={isEditMode} taskGroupProps={{id, pub_time: pubTime, name, description}}/> :
        null;
    const totalScoreExtra = isGroupClosed ?
        <span className={'task-group__score'} suppressHydrationWarning>+{totalScore}</span> :
        null;
    const label = <div className='task-group__name-with-score'>
        <span className={'task-group__name-text'}>{name}</span>
        {totalScoreExtra}
    </div>

    const items: CollapseProps['items'] = [
        {
            key: id,
            label,
            children: (
                <>
                    {isEditMode ? (
                        <div className={'task-group__settings-wrapper'}>
                            <h2 className={classNames('roboto-flex-header', 'task-group__settings-header')}>Настройки уровня</h2>
                            <div className={'task-group__settings-row'}>
                                <span className={'task-group__setting-name'}>Описание уровня</span>
                                {description ? (
                                    <Markdown className={classNames('line-break', 'task-group__setting-value')}
                                              disallowedElements={['pre', 'code']}
                                              remarkPlugins={[remarkGfm]}>
                                        {description?.toString()}
                                    </Markdown>
                                ) : (
                                    <span className={'light-description'}>Нет</span>
                                )}

                            </div>
                            <div className={'task-group__settings-row'}>
                                <span className={'task-group__setting-name'}>Время на прохождение</span>
                                <span className={'task-group__setting-value'}>Не ограничено</span>
                            </div>
                        </div>
                    ) : (
                        <div suppressHydrationWarning>
                            {description && <Markdown className={classNames('line-break', 'task-group__description')} disallowedElements={['pre', 'code']}
                                                      remarkPlugins={[remarkGfm]}>
                                {description?.toString()}
                            </Markdown>}
                        </div>
                    )}
                    {totalScore && totalScore > 0 ? (
                        <Button
                            block
                            ghost
                            style={{border: 'none', borderTop: '1px solid var(--stroke-secondary)'}}
                            onClick={() => setShowSolvedTasks(prevState => !prevState)}
                        >
                            {showSolvedTasks ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            {showSolvedTasks ? 'Скрыть ' : 'Показать '}решенные задачи
                        </Button>
                    ) : null}
                    {solvedTasksFirst &&
                        <>
                            {solvedTasksFirst.map((task) => (!task.score || task.score && showSolvedTasks) && (
                                    <div className={'task-group__task'} key={task.pub_time + task.id}>
                                        <Task
                                            props={task}
                                            mode={mode}
                                            questId={questId}
                                            taskGroupProps={{ id, pub_time: pubTime, name }}
                                            key={task.pub_time + task.id}
                                        />
                                        {getTaskExtra(isEditMode, false, {
                                            id,
                                            pub_time: pubTime,
                                            name,
                                        }, task, questId)}
                                    </div>))
                            }
                        </>
                    }
                </>),
            headerClass: classNames(
                'tasks__name',
                'task-group__name',
                'roboto-flex-header',
                isGroupClosed && 'closed-group',
            ),
            extra: collapseExtra,
        },
    ];

    return (
        <ContentWrapper className={'tasks__content-wrapper'}>
            <Collapse
                ghost
                items={items}
                className={classNames('task-group__collapse', 'tasks__collapse')}
                collapsible={'header'}
                defaultActiveKey={isEditMode ? id : undefined}
            />
        </ContentWrapper>
    );
}
