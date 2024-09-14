'use client';

import {IAdminLeaderboardResponse, ITaskGroupsAdminResponse} from '@/app/types/quest-interfaces';
import EditQuest from '@/components/Quest/EditQuest/EditQuest';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import Link from 'next/link';
import { Button, ConfigProvider, message, Modal, Tabs, TabsProps } from 'antd';
import {
    ArrowLeftOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    NotificationOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';
import { SelectAdminTabs } from '@/components/QuestAdmin/QuestAdmin.helpers';
import Tasks from '@/components/Tasks/Tasks';
import { TasksMode } from '@/components/Tasks/Tasks.helpers';
import theme, { redOutlinedButton } from '@/lib/theme/themeConfig';
import Leaderboard from '@/components/QuestAdmin/Leaderboard/Leaderboard';
import { deleteQuest, finishQuest, getLeaderboardAdmin } from '@/app/api/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FRONTEND_URL } from '@/app/api/client/constants';
import { useTasksContext } from '@/components/Tasks/ContextProvider/ContextProvider';
import dynamic from 'next/dynamic';


const DynamicEditTaskGroup = dynamic(() => import('@/components/Tasks/TaskGroup/EditTaskGroup/EditTaskGroup'),
    {ssr: false})

export default function QuestAdmin({questData} : {questData: ITaskGroupsAdminResponse}) {
    const router = useRouter();
    const {data: contextData} = useTasksContext()!;
    const [selectedTab, setSelectedTab] = useState<SelectAdminTabs>(SelectAdminTabs.ABOUT);
    const [leaderboardTabContent, setLeaderboardTabContent] = useState<IAdminLeaderboardResponse>({results: []});
    const aboutTabContent = <EditQuest questData={questData}/>;
    const tasksTabContent = <Tasks mode={TasksMode.EDIT} props={contextData.task_groups} questId={questData.quest.id}/>;
    const {data: session} = useSession();
    const [modal, modalContextHolder] = Modal.useModal();
    const [messageApi, contextHolder] = message.useMessage();
    const [isOpenModal, setIsOpenModal] = useState(false);

    const publishResults = () => finishQuest(questData.quest.id, session?.accessToken);
    const publishResultsButton =
        <Button type={'primary'} className={'publish-results'} onClick={publishResults}>
            <NotificationOutlined />Опубликовать результаты
        </Button>;

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
                    await deleteQuest(questData.quest.id, session?.accessToken)
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
            const data = await getLeaderboardAdmin(questData.quest.id, session?.accessToken) as IAdminLeaderboardResponse;
            setLeaderboardTabContent(data);
        }

        setSelectedTab(valueTab);
    }

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
                <ConfigProvider theme={theme}>
                    <Tabs
                        rootClassName={'quest-admin__tabs'}
                        items={tabs}
                        activeKey={selectedTab}
                        defaultActiveKey={selectedTab}
                        onTabClick={handleSelectTab}
                        tabBarExtraContent={selectedTab === SelectAdminTabs.LEADERBOARD &&
                            questData.quest.status === 'WAIT_RESULTS' && publishResultsButton}
                    />
                    {selectedTab === SelectAdminTabs.LEADERBOARD &&
                        questData.quest.status === 'WAIT_RESULTS' && publishResultsButton}
                </ConfigProvider>
            </div>
        </ContentWrapper>
            {selectedTab === SelectAdminTabs.ABOUT && aboutTabContent}
            {selectedTab === SelectAdminTabs.TASKS && (
                <>
                    {tasksTabContent}
                    <div style={{display: 'flex', gap: '8px', padding: '24px 32px'}}>
                        <Button onClick={handleAddTaskGroup}><PlusOutlined/>Добавить раздел</Button>
                        {/* <Button type={'primary'} onClick={handleSaveRequest}>Сохранить</Button> */}
                    </div>
                </>
            )}
            {selectedTab === SelectAdminTabs.LEADERBOARD && <Leaderboard questId={questData.quest.id} teams={leaderboardTabContent}/>}
            <DynamicEditTaskGroup
                questId={questData.quest.id}
                isOpen={isOpenModal}
                setIsOpen={setIsOpenModal}
            />
        </div>
    );
}
