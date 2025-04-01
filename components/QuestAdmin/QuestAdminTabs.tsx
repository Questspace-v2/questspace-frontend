'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Tabs, Button, ConfigProvider, Modal, message } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useTasksContext } from '@/components/Tasks/ContextProvider/ContextProvider';
import theme from '@/lib/theme/themeConfig';
import { SelectAdminTabs } from '@/components/QuestAdmin/QuestAdmin.helpers';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import React, { ReactNode } from 'react';
import { deleteQuest } from '@/app/api/api';
import { FRONTEND_URL } from '@/app/api/client/constants';
import { useSession } from 'next-auth/react';

const tabsInsideContentWrapper = [SelectAdminTabs.LOGS];

export default function QuestAdminTabs({
    children,
    extraButton
}: {
    children: ReactNode;
    extraButton?: ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();
    const { data: contextData } = useTasksContext()!;
    const [modal, modalContextHolder] = Modal.useModal();
    const [messageApi, contextHolder] = message.useMessage();

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

    const getActiveTab = (): SelectAdminTabs => {
        if (pathname.includes('/about')) return SelectAdminTabs.ABOUT;
        if (pathname.includes('/logs')) return SelectAdminTabs.LOGS;
        if (pathname.includes('/tasks')) return SelectAdminTabs.TASKS;
        if (pathname.includes('/teams')) return SelectAdminTabs.TEAMS;
        if (pathname.includes('/leaderboard')) return SelectAdminTabs.LEADERBOARD;
        return SelectAdminTabs.ABOUT;
    };

    const activeTab = getActiveTab();
    const isTabInside = tabsInsideContentWrapper.includes(activeTab);

    const renderExtraButton = (() => {
        switch (activeTab) {
            case SelectAdminTabs.LEADERBOARD:
                return contextData.quest.status === 'WAIT_RESULTS'
            default:
                return true
        }
    })()

    const handleTabChange = (key: string) => {
        const tab = key as SelectAdminTabs;
        const basePath = `/quest/${contextData.quest.id}/edit`;

        switch(tab) {
            case SelectAdminTabs.ABOUT:
                router.push(basePath);
                break;
            case SelectAdminTabs.TASKS:
                router.push(`${basePath}/tasks`);
                break;
            case SelectAdminTabs.LOGS:
                router.push(`${basePath}/logs`);
                break;
            case SelectAdminTabs.TEAMS:
                router.push(`${basePath}/teams`);
                break;
            case SelectAdminTabs.LEADERBOARD:
                router.push(`${basePath}/leaderboard`);
                break;
            default:
                router.push(basePath);
        }
    };

    const tabs = [
        { key: SelectAdminTabs.ABOUT, label: 'О квесте' },
        { key: SelectAdminTabs.TASKS, label: 'Задачи' },
        { key: SelectAdminTabs.LOGS, label: 'Логи' },
        { key: SelectAdminTabs.TEAMS, label: 'Участники' },
        { key: SelectAdminTabs.LEADERBOARD, label: 'Лидерборд' },
    ];

    return (
        <div className={'admin-page__content'}>
            {modalContextHolder}
            <ContentWrapper className={'quest-admin__content-wrapper'}>
                {contextHolder}
                <div className={'quest-admin__header__content'}>
                    <div className={'quest-admin__upper-wrapper'}>
                        <Link
                            href={`/quest/${contextData.quest.id}`}
                            style={{textDecoration: 'none', width: 'min-content', maxWidth: '50%'}}
                            prefetch
                        >
                            <Button className={'return__button'} type={'link'} size={'middle'}>
                                <ArrowLeftOutlined />{contextData.quest.name}
                            </Button>
                        </Link>
                        <Button className={'delete-quest__button'} onClick={handleDelete} danger>
                            <DeleteOutlined/>Удалить квест
                        </Button>
                    </div>
                    <h1 className={'roboto-flex-header responsive-header-h1'}>Управление квестом</h1>
                    <ConfigProvider theme={theme}>
                        <Tabs
                            rootClassName={'quest-admin__tabs'}
                            tabBarExtraContent={renderExtraButton && extraButton}
                            activeKey={activeTab}
                            items={tabs}
                            onChange={handleTabChange}
                        />
                        {renderExtraButton && extraButton}
                    </ConfigProvider>
                </div>
                {isTabInside && children}
            </ContentWrapper>

            {!isTabInside && children}
        </div>
    );
}