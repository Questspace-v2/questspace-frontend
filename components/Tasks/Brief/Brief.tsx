'use client';

import { TasksMode } from '@/components/Tasks/Task/Task.helpers';
import { Collapse, CollapseProps, Switch } from 'antd';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { useTasksContext } from '@/components/Tasks/ContextProvider/ContextProvider';
import React, { useState } from 'react';
import classNames from 'classnames';
import BriefEditButtons from '@/components/Tasks/Brief/BriefEditButtons/BriefEditButtons';
import remarkGfm from 'remark-gfm';
import Markdown from 'react-markdown';
import { updateQuest } from '@/app/api/api';
import { IQuest } from '@/app/types/quest-interfaces';
import { useSession } from 'next-auth/react';
import { QuestStatus } from '@/components/Quest/Quest.helpers';


interface BriefProps {
    mode: TasksMode,
}

export default function Brief({mode} : BriefProps) {
    const isEditMode = mode === TasksMode.EDIT;
    const { data: contextData, updater: setContextData} = useTasksContext()!;
    const { data: sessionData } = useSession();
    const accessToken = sessionData?.accessToken;
    // если опираться на чистый has_brief в свитче, то будет лаг интерфейса из-за передачи по сети
    const [ switchValue, setSwitchValue ] = useState<boolean>(contextData?.quest?.has_brief ?? false);
    const isBeforeQuestStart = contextData?.quest?.status === QuestStatus.StatusRegistrationDone as string ||
        contextData?.quest?.status === QuestStatus.StatusOnRegistration as string
    const [ isOpen, setIsOpen ] = useState(isEditMode ? Boolean(contextData?.quest?.has_brief) : isBeforeQuestStart);

    if (!isEditMode && (!contextData?.quest?.has_brief || !contextData?.quest?.brief)) {
        return null;
    }

    const onChangeSwitch = async (checked: boolean) => {
        if (!isOpen && checked) {
            setIsOpen(true);
        }

        const data = {
            ...contextData.quest,
            has_brief: checked,
        }

        setSwitchValue(checked);

        const result = await updateQuest(contextData.quest.id, data, accessToken)
            .then(resp => resp as IQuest)
            .catch(error => {
                throw error;
            });

        if (result) {
            setContextData((prevState) => ({
                ...prevState,
                quest: result
            }));
        }
    }

    const collapseExtra = isEditMode ? (
        <div className={classNames('tasks__collapse-buttons', 'brief__extra')}>
            <span className={'brief__extra__content'}>Показывать до старта</span>
            <Switch value={switchValue} size={'small'} onChange={onChangeSwitch} />
        </div>) :
    null;

    const items: CollapseProps['items'] = [
        {
            key: contextData?.quest?.id,
            label: 'Бриф',
            children: isEditMode ?
                <BriefEditButtons /> :
                <Markdown
                    className={classNames('line-break', 'brief__text')}
                    disallowedElements={['pre', 'code']}
                    remarkPlugins={[remarkGfm]}
                >
                    {contextData?.quest?.brief}
                </Markdown>,
            headerClass: classNames(
                'tasks__name',
                'brief__name',
                'roboto-flex-header',
                !switchValue && 'brief__name_off'
            ),
            extra: collapseExtra
        },
    ];

    if (isEditMode) {
        return (
            <ContentWrapper className={'tasks__content-wrapper'}>
                <Collapse
                    activeKey={isOpen ? contextData?.quest?.id : undefined}
                    ghost
                    items={items}
                    className={classNames('brief__collapse', 'tasks__collapse')}
                    onChange={() => setIsOpen(!isOpen)}
                    collapsible={'header'}
                    defaultActiveKey={contextData?.quest?.has_brief ? contextData?.quest?.id : undefined}
                />
            </ContentWrapper>
        )
    }

    return (
        <ContentWrapper className={'tasks__content-wrapper'}>
            <Collapse
                activeKey={isOpen ? contextData?.quest?.id : undefined}
                ghost
                items={items}
                className={classNames('brief__collapse', 'tasks__collapse')}
                onChange={() => setIsOpen(!isOpen)}
                collapsible={'header'}
                defaultActiveKey={isBeforeQuestStart ? contextData?.quest?.id : undefined}
            />
        </ContentWrapper>
    );
}
