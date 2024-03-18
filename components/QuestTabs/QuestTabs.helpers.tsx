import { Button, ConfigProvider, Empty } from 'antd';
import { PlusOutlined, SmileOutlined } from '@ant-design/icons';
import QuestCard from '@/components/QuestCard/QuestCard';

const selectTab = ['all-quests', 'my-quests', 'created-quests'] as const;
export type SelectTab = (typeof selectTab)[number];


// @ts-expect-error мы точно знаем, что в SelectTab string
export const isSelectTab = (x: string): x is SelectTab => selectTab.includes(x);

export const createQuestButton = (
    <ConfigProvider>
        <Button
            className={'create-quest__button'}
            type={'link'}
            href={'/quest/create'}
            icon={<PlusOutlined style={{ color: 'var(--primary-color)'}}/>}
            style={{ color: 'var(--primary-color)' }}
        >
            Создать квест
        </Button>
    </ConfigProvider>
);

export const customizedEmpty = (
    <Empty
        image={<SmileOutlined style={{ fontSize: 48, opacity: 0.5 }} />}
        description={
            <span>
                Квесты не найдены
                <br />
                Попробуйте{' '}
                <a
                    className={'create-quest-button'}
                    href={'/quest/create'}
                    style={{ color: '#1890FF' }}
                >
                    создать квест
                </a>
            </span>
        }
        style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '48px 0',
            gridColumn: '1/5'
        }}
        imageStyle={{ height: 'auto' }}
    />
);

export function getQuests(tab: SelectTab) {
    const result : JSX.Element[] = [];

    if (tab === 'all-quests') {
        for (let i = 0; i < 10; i++) {
            result.push(<div key={i}><QuestCard mode={'preview'} props={{name: i.toString()}}/></div>)
        }
        return result;
    }
    return customizedEmpty;
}
