/* eslint-disable react-hooks/exhaustive-deps */

'use client'

import { ConfigProvider, Select, Tabs, TabsProps, ThemeConfig } from 'antd';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import {
    createQuestButton,
    isSelectTab, SelectTab,
} from '@/components/QuestTabs/QuestTabs.helpers';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { useEffect, useState } from 'react';
import getBackendQuests from '@/components/QuestTabs/QuestTabs.server';

import './QuestTabs.css';
import { IQuest } from '@/app/types/quest-interfaces';
import QuestCardsList from '@/components/QuestTabs/QuestCardsList/QuestCardsList';
import { useInView } from 'react-intersection-observer';

export default function QuestTabs({fetchedAllQuests, nextPageId} : {fetchedAllQuests: IQuest[], nextPageId: string}) {
    const { xs} = useBreakpoint();
    const [selectedTab, setSelectedTab] = useState<SelectTab>('all');
    const [tabContent, setTabContent] = useState<IQuest[]>(fetchedAllQuests);
    const [page, setPage] = useState(nextPageId);
    const [canRequest, setCanRequest] = useState(true);

    const { ref, inView } = useInView();

    const themeConfig: ThemeConfig = {
        components: {
            Select: {
                colorTextPlaceholder: '#1890FF',
                colorPrimary: '#1890FF',
                colorPrimaryTextActive: '#1890FF',
                colorTextHeading: '#1890FF',
                fontWeightStrong: 400,
                colorIcon: '#1890FF',
                colorIconHover: '#1890FF',
            }
        },
    };

    const items: TabsProps['items'] = [
        {
            key: 'all',
            label: 'Все квесты',
            children: selectedTab === 'all' ? <><QuestCardsList quests={tabContent} /><div ref={ref}/></> : undefined,
        },
        {
            key: 'registered',
            label: 'Мои квесты',
            children: selectedTab === 'registered' ? <><QuestCardsList quests={tabContent} /><div ref={ref} /></> : undefined,
        },
        {
            key: 'owned',
            label: 'Созданные квесты',
            children: selectedTab === 'owned' ? <><QuestCardsList quests={tabContent} /><div ref={ref} /></> : undefined,
        },
    ];

    const selectOptions: {value: SelectTab, label: string}[] = [
        { value: 'all', label: 'Все квесты' },
        { value: 'registered', label: 'Мои квесты' },
        { value: 'owned', label: 'Созданные квесты' },
    ];

    const loadMoreQuests = async () => {
        const data = await getBackendQuests(selectedTab, page);
        const newQuests = data?.quests ?? [];
        const nextPage = data?.next_page_id ?? '';
        setCanRequest(!!nextPage);
        setTabContent((prevQuests: IQuest[]) => [...prevQuests, ...newQuests]);
        setPage(nextPage);
    }

    useEffect(() => {
        if (inView && canRequest) {
            loadMoreQuests().catch(err => {
                throw err;
            });
        }
    }, [inView]);

    const handleSelectTab = async (value: string) => {
        if (!isSelectTab(value) || value === selectedTab) {
            return;
        }
        setCanRequest(true);
        const data = await getBackendQuests(value as SelectTab);
        const content = data?.quests ?? [];
        const nextPage = data?.next_page_id ?? '';
        setCanRequest(!!nextPage);
        setSelectedTab(value);
        setTabContent(content);
        setPage(nextPage);
    }

    if (xs) {
        return (
            <ContentWrapper>
                <section
                    className={'quest-tabs'}
                    style={{
                        width: '100%',
                        margin: '16px 0 32px',
                    }}
                >
                    <div
                        className={'quest-tabs__header'}
                    >
                        <ConfigProvider theme={themeConfig}>
                            <Select
                                tabIndex={0}
                                defaultValue={selectedTab}
                                defaultActiveFirstOption={false}
                                style={{
                                    width: 'max-content',
                                    color: '#1890FF',
                                }}
                                dropdownStyle={{width: 'max-content'}}
                                variant={'borderless'}
                                options={selectOptions}
                                onSelect={handleSelectTab}
                            />
                        </ConfigProvider>
                        {createQuestButton}
                    </div>
                    <div className={'quest-tabpane'}>
                        <QuestCardsList quests={tabContent} />
                        <div ref={ref}/>
                    </div>
                </section>
            </ContentWrapper>
        );
    }
    return (
            <ContentWrapper>
                <ConfigProvider theme={themeConfig}>
                <Tabs
                    className={'quest-tabs'}
                    tabBarExtraContent={createQuestButton}
                    items={items}
                    activeKey={selectedTab}
                    style={{
                        width: '100%',
                        minHeight: '250px',
                        margin: '8px 0 24px 0',
                    }}
                    onTabClick={handleSelectTab}
                    destroyInactiveTabPane
                />
                </ConfigProvider>
            </ContentWrapper>
        )
}
