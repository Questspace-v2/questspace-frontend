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
import React, { useEffect, useRef, useState } from 'react';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { getLongTimeDiff } from '@/components/Quest/Quest.helpers';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const Countdown = dynamic(() => import('../../CustomCountdown/CustomCountdown'), {
    ssr: false
})

interface TaskGroupProps {
    mode: TasksMode,
    props: ITaskGroup,
    questId: string
}

export default function TaskGroup({mode, props, questId} : TaskGroupProps) {
    const router = useRouter();
    const collapseRef = useRef<HTMLDivElement>(null);
    const isEditMode = mode === TasksMode.EDIT;
    const dateNow = new Date();
    const { id, pub_time: pubTime, name, description, time_limit: timeLimit, has_time_limit: hasTimeLimit } = props;
    const {data: contextData} = useTasksContext()!;
    const currentTaskGroup = contextData?.task_groups?.find((group) => group.id === id);
    const expirationDate = (
        currentTaskGroup?.has_time_limit &&
        currentTaskGroup?.time_limit &&
        currentTaskGroup?.team_info
    ) ?
        new Date(new Date(currentTaskGroup.team_info.opening_time).getTime() + currentTaskGroup.time_limit * 1000) : null;
    const isLinear = contextData.quest.quest_type === 'LINEAR';
    const [showSolvedTasks, setShowSolvedTasks] = useState<boolean>(false);
    const tasks = contextData.task_groups.find(item => item.id === id)?.tasks ?? [];
    const isGroupClosed = tasks.length > 0 && tasks
        .every(item => item.score !== undefined && (item.score > 0 || isEditMode));
    const solvedTasksFirst = tasks.sort((a, b) => +!!b.score - +!!a.score);
    const totalScore = tasks.reduce((a, b) => a + (b.score ?? 0), 0);

    const [showCountdown, setShowCountdown] = useState(!isGroupClosed && expirationDate && dateNow < expirationDate);
    const onTimerCompete = () => {
        router.refresh();
        setShowCountdown(false);
    };

    const collapseExtra = isEditMode ?
        <TaskGroupExtra questId={questId} edit={isEditMode} taskGroupProps={{id, pub_time: pubTime, name, description}}/> :
        null;
    const totalScoreExtra = isGroupClosed ?
        <span className={'task-group__score'} suppressHydrationWarning>+{totalScore}</span> :
        null;
    const label = (
        <div className="task-group__name-with-score" suppressHydrationWarning>
            <span className={'task-group__name-text'}>{name}</span>
            {showCountdown && expirationDate ? (
                <span className={'task-group__countdown'}>
                    <Countdown
                        date={expirationDate}
                        daysInHours
                        onComplete={onTimerCompete}
                    />
                </span>
            ) : (
                totalScoreExtra
            )}
        </div>
    );

    const items: CollapseProps['items'] = [
        {
            key: id,
            label,
            children: (
                <>
                    {isEditMode ? (
                        <div className={'task-group__settings-wrapper'}>
                            <h2
                                className={classNames(
                                    'roboto-flex-header',
                                    'task-group__settings-header',
                                )}
                            >
                                Настройки уровня
                            </h2>
                            <div className={'task-group__settings-row'}>
                                <span className={'task-group__setting-name'}>
                                    Описание уровня
                                </span>
                                {description ? (
                                    <Markdown
                                        className={classNames(
                                            'line-break',
                                            'task-group__setting-value',
                                        )}
                                        disallowedElements={['pre', 'code']}
                                        remarkPlugins={[remarkGfm]}
                                    >
                                        {description?.toString()}
                                    </Markdown>
                                ) : (
                                    <span className={'light-description'}>
                                        Нет
                                    </span>
                                )}
                            </div>
                            <div className={'task-group__settings-row'}>
                                <span className={'task-group__setting-name'}>
                                    Время на прохождение
                                </span>
                                <span className={'task-group__setting-value'}>
                                    {isLinear && hasTimeLimit && timeLimit
                                        ? getLongTimeDiff(
                                              dateNow,
                                              new Date(
                                                  dateNow.getTime() +
                                                      timeLimit * 1000,
                                              ),
                                          )
                                        : 'Не ограничено'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div suppressHydrationWarning>
                            {description && (
                                <Markdown
                                    className={classNames(
                                        'line-break',
                                        'task-group__description',
                                    )}
                                    disallowedElements={['pre', 'code']}
                                    remarkPlugins={[remarkGfm]}
                                >
                                    {description?.toString()}
                                </Markdown>
                            )}
                        </div>
                    )}
                    {totalScore && totalScore > 0 ? (
                        <Button
                            block
                            ghost
                            style={{
                                border: 'none',
                                borderTop: '1px solid var(--stroke-secondary)',
                            }}
                            onClick={() =>
                                setShowSolvedTasks(prevState => !prevState)
                            }
                        >
                            {showSolvedTasks ? (
                                <EyeInvisibleOutlined />
                            ) : (
                                <EyeOutlined />
                            )}
                            {showSolvedTasks ? 'Скрыть ' : 'Показать '}решенные
                            задачи
                        </Button>
                    ) : null}
                    {solvedTasksFirst && (
                        <>
                            {solvedTasksFirst.map(
                                task =>
                                    (!task.score ||
                                        (task.score && showSolvedTasks)) && (
                                        <div
                                            className={'task-group__task'}
                                            key={task.pub_time + task.id}
                                        >
                                            <Task
                                                props={task}
                                                mode={mode}
                                                questId={questId}
                                                taskGroupProps={{
                                                    id,
                                                    pub_time: pubTime,
                                                    name
                                                }}
                                                isExpired={expirationDate !== null && dateNow >= expirationDate}
                                                key={task.pub_time + task.id}
                                            />
                                            {getTaskExtra(
                                                isEditMode,
                                                false,
                                                {
                                                    id,
                                                    pub_time: pubTime,
                                                    name,
                                                },
                                                task,
                                                questId,
                                            )}
                                        </div>
                                    ),
                            )}
                        </>
                    )}
                </>
            ),
            headerClass: classNames(
                'tasks__name',
                'task-group__name',
                'roboto-flex-header',
                isGroupClosed && 'closed-group',
            ),
            extra: collapseExtra,
        },
    ];

    useEffect(() => {
        if (!collapseRef.current) return;

        const header = collapseRef.current.querySelector(".ant-collapse-header");
        if (!header) return;

        const observer = new IntersectionObserver(
          ([entry]) => {
            header.classList.toggle("sticky-header", entry.intersectionRatio < 1);
          },
          { threshold: [1], rootMargin: "-64px 0px 0px 0px" }
        );

        observer.observe(header);
    }, []);

    return (
        <ContentWrapper className={'tasks__content-wrapper'}>
            <Collapse
                ref={collapseRef}
                ghost
                items={items}
                className={classNames('task-group__collapse', 'tasks__collapse')}
                collapsible={'header'}
                defaultActiveKey={isEditMode ? id : undefined}
            />
        </ContentWrapper>
    );
}
