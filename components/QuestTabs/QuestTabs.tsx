'use client'

import { ConfigProvider, Select, Tabs, TabsProps, ThemeConfig } from 'antd';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';

import './QuestTabs.css';
import {
    createQuestButton,
    getQuests, isSelectTab, SelectTab,
} from '@/components/QuestTabs/QuestTabs.helpers';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { useState } from 'react';

export default function QuestTabs() {
    const { xs} = useBreakpoint();
    const [selectedTab, setSelectedTab] = useState<SelectTab>('all-quests');
    const [tabContent, setTabContent] = useState<JSX.Element[] | JSX.Element>(getQuests(selectedTab));

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
            key: 'all-quests',
            label: 'Все квесты',
            children: selectedTab === 'all-quests' ? tabContent : undefined,
        },
        {
            key: 'my-quests',
            label: 'Мои квесты',
            children: selectedTab === 'my-quests' ? tabContent : undefined,
        },
        {
            key: 'created-quests',
            label: 'Созданные квесты',
            children: selectedTab === 'created-quests' ? tabContent : undefined,
        },
    ];

    const selectOptions: {value: SelectTab, label: string}[] = [
        { value: 'all-quests', label: 'Все квесты' },
        { value: 'my-quests', label: 'Мои квесты' },
        { value: 'created-quests', label: 'Созданные квесты' },
    ];

    const handleSelectTab = (value: string) => {
        if (!isSelectTab(value) || value === selectedTab) {
            return;
        }

        setSelectedTab(value);
        setTabContent(getQuests(value));
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
                        {tabContent}
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
                    tabBarStyle={{color: 'red'}}
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
