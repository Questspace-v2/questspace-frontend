'use client';

import {
    IAdminLeaderboardResponse,
    IGetAllTeamsResponse,
    IPaginatedAnswerLogs,
    IPaginatedAnswerLogsParams,
} from '@/app/types/quest-interfaces';
import EditQuest from '@/components/Quest/EditQuest/EditQuest';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import Link from 'next/link';
import { Button, ConfigProvider, message, Modal, Tabs, TabsProps } from 'antd';
import {
    ArrowLeftOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    NotificationOutlined, PlusOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';
import { SelectAdminTabs } from '@/components/QuestAdmin/QuestAdmin.helpers';
import Tasks from '@/components/Tasks/Tasks';
import { TasksMode } from '@/components/Tasks/Task/Task.helpers';
import theme from '@/lib/theme/themeConfig';
import Leaderboard from '@/components/QuestAdmin/Leaderboard/Leaderboard';
import { deleteQuest, finishQuest, getLeaderboardAdmin, getPaginatedAnswerLogs, getQuestTeams } from '@/app/api/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FRONTEND_URL } from '@/app/api/client/constants';
import { useTasksContext } from '@/components/Tasks/ContextProvider/ContextProvider';
import dynamic from 'next/dynamic';
import classNames from 'classnames';
import Teams from '@/components/QuestAdmin/Teams/Teams';
import { ITeam } from '@/app/types/user-interfaces';
import Logs, { LOGS_PAGE_SIZE } from './Logs/Logs';


const DynamicEditTaskGroup = dynamic(() => import('@/components/Tasks/TaskGroup/EditTaskGroup/EditTaskGroup'),
    {ssr: false})

export default function DeprecatedQuestAdmin() {
    const router = useRouter();
    const {data: contextData, updater: setContextData} = useTasksContext()!;
    const [selectedTab, setSelectedTab] = useState<SelectAdminTabs>(SelectAdminTabs.ABOUT);
    const [leaderboardContent, setLeaderboardContent] = useState<IAdminLeaderboardResponse>({results: []});
    const [teamsContent, setTeamsContent] = useState<ITeam[]>([]);
    const [logsContent, setLogsContent] = useState<IPaginatedAnswerLogs>({ answer_logs: [], total_pages: 1, next_page_token: 0 });
    const [isInfoAlertHidden, setIsInfoAlertHidden] = useState(false);
    const aboutTabContent = <EditQuest questData={contextData.quest} setContextData={setContextData} />;
    const tasksTabContent = <Tasks mode={TasksMode.EDIT} props={contextData} />;

    const teamsTabContent = <Teams teams={teamsContent} questId={contextData.quest.id} registrationType={contextData.quest.registration_type} />
    const leaderboardTabContent = <Leaderboard questId={contextData.quest.id} teams={leaderboardContent}/>;
    const answerLogsTabContent = <Logs
        questId={contextData.quest.id}
        paginatedLogs={logsContent}
        isInfoAlertHidden={isInfoAlertHidden}
        setIsInfoAlertHidden={setIsInfoAlertHidden}
    />;
    const {data: session} = useSession();
    const [modal, modalContextHolder] = Modal.useModal();
    const [messageApi, contextHolder] = message.useMessage();
    const [isOpenModal, setIsOpenModal] = useState(false);

    const publishResults = () => finishQuest(contextData.quest.id, session?.accessToken);
    const publishResultsButton =
        <Button type={'primary'} className={classNames('quest-admin__extra-button', 'publish-results__button')} onClick={publishResults}>
            <NotificationOutlined />Опубликовать результаты
        </Button>;

    const addTaskGroup = () => {
        setIsOpenModal(true);
    };
    const addTaskGroupButton =
        <Button type={'primary'} className={classNames('quest-admin__extra-button', 'add-task-group__button')} onClick={addTaskGroup}>
            <PlusOutlined /> Добавить уровень
        </Button>;

    const getTabBarExtraButton = () => {
        if (selectedTab === SelectAdminTabs.LEADERBOARD &&
            contextData.quest.status === 'WAIT_RESULTS') {
            return publishResultsButton;
        }

        if (selectedTab === SelectAdminTabs.TASKS) {
            return addTaskGroupButton;
        }

        return null;
    }

    const tabs: TabsProps['items']  = [
        {
            key: 'about',
            label: 'О квесте',
        },
        {
            key: 'tasks',
            label: 'Задачи',
        },
        {
            key: 'logs',
            label: 'Логи',
        },
        {
            key: 'teams',
            label: 'Участники',
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
                    await deleteQuest(contextData.quest.id, session?.accessToken)
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
            const data = await getLeaderboardAdmin(contextData.quest.id, session?.accessToken) as IAdminLeaderboardResponse;
            setLeaderboardContent(data);
        }

        if (valueTab === SelectAdminTabs.TEAMS) {
            const data = await getQuestTeams(contextData.quest.id) as IGetAllTeamsResponse;
            setTeamsContent(data?.teams ?? []);
        }

        if (valueTab === SelectAdminTabs.LOGS) {
            const params: IPaginatedAnswerLogsParams = {
                desc: true,
                page_size: LOGS_PAGE_SIZE
            };
            const teamsData = await getQuestTeams(contextData.quest.id) as IGetAllTeamsResponse;
            const data = await getPaginatedAnswerLogs(contextData.quest.id, session?.accessToken, params) as IPaginatedAnswerLogs;
            setLogsContent(data);
            setContextData(prevState => ({
                ...prevState,
                teams: teamsData.teams,
            }));
        }

        setSelectedTab(valueTab);
    }

    return (
        <div className={'admin-page__content'}>
            {modalContextHolder}
        <ContentWrapper className={'quest-admin__content-wrapper'}>
            {contextHolder}
            <div className={'quest-admin__header__content'}>
                <div className={'quest-admin__upper-wrapper'}>
                    <Link href={`/quest/${contextData.quest.id}`} style={{textDecoration: 'none', width: 'min-content', maxWidth: '50%'}} prefetch>
                        <Button className={'return__button'} type={'link'} size={'middle'}>
                            <ArrowLeftOutlined />{contextData.quest.name}
                        </Button>
                    </Link>
                    <Button className={'delete-quest__button'} onClick={handleDelete} danger><DeleteOutlined/>Удалить квест</Button>
                </div>
                <h1 className={'roboto-flex-header responsive-header-h1'}>Управление квестом</h1>
                <ConfigProvider theme={theme}>
                    <Tabs
                        rootClassName={'quest-admin__tabs'}
                        items={tabs}
                        activeKey={selectedTab}
                        defaultActiveKey={selectedTab}
                        onTabClick={handleSelectTab}
                        tabBarExtraContent={getTabBarExtraButton()}
                    />
                    {getTabBarExtraButton()}
                </ConfigProvider>
            </div>
            {selectedTab === SelectAdminTabs.LOGS && answerLogsTabContent}
        </ContentWrapper>
            {selectedTab === SelectAdminTabs.ABOUT && aboutTabContent}
            {selectedTab === SelectAdminTabs.TASKS && tasksTabContent}
            {selectedTab === SelectAdminTabs.TEAMS && teamsTabContent}
            {selectedTab === SelectAdminTabs.LEADERBOARD && leaderboardTabContent}
            <DynamicEditTaskGroup
                questId={contextData.quest.id}
                isOpen={isOpenModal}
                setIsOpen={setIsOpenModal}
            />
        </div>
    );
}
