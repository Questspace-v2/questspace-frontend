import { Button, ConfigProvider, Empty } from 'antd';
import { PlusOutlined, SmileOutlined } from '@ant-design/icons';
import QuestCard from '@/components/QuestCard/QuestCard';
import Link from 'next/link';
import { getFilteredQuests } from '@/app/api/api';
import { IFilteredQuestsResponse, IQuest } from '@/app/types/quest-interfaces';

const selectTab = ['all', 'registered', 'owned'] as const;
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
                <Link
                    className={'create-quest-button'}
                    href={'/quest/create'}
                    style={{ color: '#1890FF' }}
                >
                    создать квест
                </Link>
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

export function wrapInCard(quest: IQuest) {
    return (
        <QuestCard mode={'preview'} props={quest}/>
    );
}

export function getQuestsFromBackend(tab: SelectTab) {
    getFilteredQuests(
        [`${tab}`],
        undefined,
        '10'
    )
        .then(result => result as IFilteredQuestsResponse)
        .catch(err => {
            throw err;
        });
}

export function getQuests(tab: SelectTab) {
    const result : JSX.Element[] = [];

    if (tab === 'all') {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < 10; i++) {
            // @ts-expect-error Ыа, тут не только имя квеста нужно передавать
            result.push(<div key={i}><QuestCard mode={'preview'} props={{name: i.toString()}}/></div>)
        }
        return result;
    }
    return customizedEmpty;
}
