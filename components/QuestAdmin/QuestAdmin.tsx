'use client';

import {ITaskGroupsAdminResponse} from '@/app/types/quest-interfaces';
import EditQuest from '@/components/Quest/EditQuest/EditQuest';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import Link from 'next/link';
import { Button, ConfigProvider, message, Modal, Tabs, TabsProps } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { SelectAdminTabs } from '@/components/QuestAdmin/QuestAdmin.helpers';
import Tasks from '@/components/Tasks/Tasks';
import { TasksMode } from '@/components/Tasks/Tasks.helpers';
import { redOutlinedButton } from '@/lib/theme/themeConfig';
import Leaderboard from '@/components/QuestAdmin/Leaderboard/Leaderboard';
import {createTaskGroupsAndTasks} from '@/app/api/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FRONTEND_URL } from '@/app/api/client/constants';
import { useTasksContext } from '@/components/Tasks/ContextProvider/ContextProvider';
import dynamic from 'next/dynamic';
import QuestService from '@/app/api/services/quest.service';
import PlayModeService from '@/app/api/services/play-mode.service';
import {AdminLeaderboardResponseDto} from '@/app/api/dto/play-mode-dto/admin-leaderboard-response.dto';


const DynamicEditTaskGroup = dynamic(() => import('@/components/Tasks/TaskGroup/EditTaskGroup/EditTaskGroup'),
    {ssr: false})

export default function QuestAdmin({questData} : {questData: ITaskGroupsAdminResponse}) {
    const router = useRouter();
    const {data: contextData} = useTasksContext()!;
    const [selectedTab, setSelectedTab] = useState<SelectAdminTabs>(SelectAdminTabs.ABOUT);
    const [leaderboardTabContent, setLeaderboardTabContent] = useState<AdminLeaderboardResponseDto>({results: []});

    const aboutTabContent = <EditQuest questData={questData}/>;
    const tasksTabContent = <Tasks mode={TasksMode.EDIT} props={contextData.task_groups} questId={questData.quest.id}/>;
    const {data: session} = useSession();
    const [modal, modalContextHolder] = Modal.useModal();
    const [messageApi, contextHolder] = message.useMessage();
    const [isOpenModal, setIsOpenModal] = useState(false);

    if (!session) {
        return null;
    }

    const questService = new QuestService();
    const playModeService = new PlayModeService();

    const tabs: TabsProps['items']  = [
        {
            key: 'about',
            label: 'О квесте',
        },
        {
            key: 'tasks',
            label: 'Задания',
        },
        {
            key: 'leaderboard',
            label: 'Лидерборд',
        },
    ];

    const error = () => {
        // eslint-disable-next-line no-void
        void messageApi.open({
            type: 'error',
            content: 'Что-то пошло не так',
        });
    };

    const handleDelete = async () => {
        await modal.confirm({
            title: 'Вы хотите удалить квест?',
            icon: <ExclamationCircleOutlined />,
            className: 'confirm-delete__modal',
            cancelText: 'Нет',
            cancelButtonProps: {type: 'primary'},
            okText: 'Да',
            okType: 'default',
            centered: true,
            async onOk() {
                try {
                    await questService
                        .deleteQuest(questData.quest.id, session?.accessToken)
                        .then(() => router.push(`${FRONTEND_URL}`, {scroll: false}));
                } catch (err) {
                    error();
                }
            }
        });
    };

    const handleSelectTab = async (value: string) => {
        const valueTab = value as SelectAdminTabs;
        if (!(valueTab || value)) {
            return;
        }
        if (valueTab === SelectAdminTabs.LEADERBOARD) {
            const data = await playModeService
                .getAdminLeaderboard(questData.quest.id, session?.accessToken);
            setLeaderboardTabContent(data);
        }

        setSelectedTab(valueTab);
    }

    const handleSaveRequest = async () => {
        await createTaskGroupsAndTasks(questData.quest.id, contextData, session?.accessToken);
    };

    const handleAddTaskGroup = () => {
        setIsOpenModal(true);
    };

    return (
        <div className={'admin-page__content'}>
            {modalContextHolder}
        <ContentWrapper className={'quest-admin__content-wrapper'}>
            {contextHolder}
            <div className={'quest-admin__header__content'}>
                <div className={'quest-admin__upper-wrapper'}>
                    <Link href={`/quest/${questData.quest.id}`} style={{textDecoration: 'none', width: 'min-content', maxWidth: '50%'}} >
                        <Button className={'return__button'} type={'link'} size={'middle'}>
                            <ArrowLeftOutlined />{questData.quest.name}
                        </Button>
                    </Link>
                    <ConfigProvider theme={redOutlinedButton}>
                        <Button className={'delete-quest__button'} onClick={handleDelete}><DeleteOutlined/>Удалить квест</Button>
                    </ConfigProvider>
                </div>
                <h1 className={'roboto-flex-header responsive-header-h1'}>Управление квестом</h1>
                <Tabs
                    items={tabs}
                    activeKey={selectedTab}
                    defaultActiveKey={selectedTab}
                    onTabClick={handleSelectTab}
                />
            </div>
        </ContentWrapper>
            {selectedTab === SelectAdminTabs.ABOUT && aboutTabContent}
            {selectedTab === SelectAdminTabs.TASKS && (
                <>
                    {tasksTabContent}
                    <div style={{display: 'flex', gap: '8px', padding: '24px 32px'}}>
                        <Button onClick={handleAddTaskGroup}><PlusOutlined/>Добавить раздел</Button>
                        <Button type={'primary'} onClick={handleSaveRequest}>Сохранить</Button>
                    </div>
                </>
            )}
            {selectedTab === SelectAdminTabs.LEADERBOARD && <Leaderboard teams={leaderboardTabContent}/>}
            <DynamicEditTaskGroup
                questId={questData.quest.id}
                isOpen={isOpenModal}
                setIsOpen={setIsOpenModal}
            />
        </div>
    );
}
