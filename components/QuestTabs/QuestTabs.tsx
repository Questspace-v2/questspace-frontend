import { ConfigProvider, Select, Tabs, TabsProps, ThemeConfig } from 'antd';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';

import './QuestTabs.css';
import {
    createQuestButton,
    customizedEmpty,
    getQuests,
} from '@/components/QuestTabs/QuestTabs.helpers';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';

export default function QuestTabs() {
    const { sm } = useBreakpoint();

    const selectTheme: ThemeConfig = {
        components: {
            Select: {
                colorTextPlaceholder: '#1890FF',
                colorPrimary: '#1890FF',
                colorPrimaryTextActive: '#1890FF',
                colorTextHeading: '#1890FF',
                fontWeightStrong: 400,
                colorIcon: '#1890FF',
                colorIconHover: '#1890FF',
            },
        },
    };

    const items: TabsProps['items'] = [
        {
            key: 'all-quests',
            label: 'Все квесты',
            children: getQuests(),
        },
        {
            key: 'my-quests',
            label: 'Мои квесты',
            children: getQuests(),
        },
        {
            key: 'created-quests',
            label: 'Созданные квесты',
            children: getQuests(),
        },
    ];

    const selectOptions = [
        { value: 'all-quests', label: 'Все квесты' },
        { value: 'my-quests', label: 'Мои квесты' },
        { value: 'created-quests', label: 'Созданные квесты' },
    ];

    return (
        <ContentWrapper>
            {sm ? (
                <Tabs
                    className={'quest-tabs'}
                    tabBarExtraContent={createQuestButton}
                    items={items}
                    style={{
                        width: '100%',
                        minHeight: '250px',
                        margin: '8px 0 24px 0',
                    }}
                />
            ) : (
                <section
                    className={'quest-tabs'}
                    style={{
                        width: '100%',
                        margin: '16px 0 32px',
                    }}
                >
                    <div
                        className={'quest-tabs-header'}
                        style={{
                            display: 'flex',
                            width: '100%',
                            padding: '0 0 4px',
                            justifyContent: 'space-between',
                            borderBottom: '1px #D9D9D9',
                        }}
                    >
                        <ConfigProvider theme={selectTheme}>
                            <Select
                                defaultValue={'all-quests'}
                                style={{
                                    width: 'max-content',
                                    color: '#1890FF',
                                }}
                                bordered={false}
                                options={selectOptions}
                            />
                        </ConfigProvider>
                        {createQuestButton}
                    </div>
                </section>
            )}
        </ContentWrapper>
    );
}
