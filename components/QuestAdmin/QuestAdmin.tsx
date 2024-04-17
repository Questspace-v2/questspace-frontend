'use client';

import { IGetQuestResponse } from '@/app/types/quest-interfaces';
import EditQuest from '@/components/Quest/EditQuest/EditQuest';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import Link from 'next/link';
import { Button, ConfigProvider, Modal, Tabs, TabsProps } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { SelectAdminTabs } from '@/components/QuestAdmin/QuestAdmin.helpers';
import Tasks from '@/components/Tasks/Tasks';
import { TasksMode } from '@/components/Tasks/Tasks.helpers';
import { redOutlinedButton } from '@/lib/theme/themeConfig';
import { taskGroupMock } from '@/app/api/__mocks__/Task.mock';

import './QuestAdmin.css';
import Leaderboard from '@/components/QuestAdmin/Leaderboard/Leaderboard';
import { deleteQuest, getQuestTeams } from '@/app/api/api';
import { ITeam } from '@/app/types/user-interfaces';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FRONTEND_URL } from '@/app/api/client/constants';

export default function QuestAdmin({questData} : {questData: IGetQuestResponse}) {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState<SelectAdminTabs>(SelectAdminTabs.ABOUT);
    const [leaderboardTabContent, setLeaderboardTabContent] = useState<ITeam[]>([]);
    const aboutTabContent = <EditQuest questData={questData}/>;
    const tasksTabContent = <Tasks mode={TasksMode.EDIT} props={[taskGroupMock, taskGroupMock]}/>;
    const {data: session} = useSession();
    const [modal, modalContextHolder] = Modal.useModal();

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
    ]

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
                await deleteQuest(questData.quest.id, session?.accessToken);
            }
        }).then(confirmed => confirmed ? router.push(`${FRONTEND_URL}`, {scroll: false}) : {}, () => {});
    };

    const handleSelectTab = async (value: string) => {
        const valueTab = value as SelectAdminTabs;
        if (!(valueTab || value)) {
            return;
        }
        if (valueTab === SelectAdminTabs.LEADERBOARD) {
            const data = await getQuestTeams(questData.quest.id) as ITeam[];
            setLeaderboardTabContent(data);
        }

        setSelectedTab(valueTab);
    }

    return (
        <div className={'admin-page__content'}>
            {modalContextHolder}
        <ContentWrapper className={'quest-admin__content-wrapper'}>
            <div className={'quest-admin__header__content'}>
                <div className={'quest-admin__upper-wrapper'}>
                    <Link href={`/quest/${questData.quest.id}`} style={{textDecoration: 'none', width: 'min-content', maxWidth: '50%'}} >
                        <Button className={'return__button'} type={'link'} size={'middle'}>
                            <ArrowLeftOutlined />{questData.quest.name}
                        </Button>
                    </Link>
                    {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
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
                        <Button><PlusOutlined/>Добавить раздел</Button>
                        <Button type={'primary'}>Сохранить</Button>
                    </div>
                </>
            )}
            {selectedTab === SelectAdminTabs.LEADERBOARD && <Leaderboard teams={leaderboardTabContent}/>}
        </div>
    );
}
