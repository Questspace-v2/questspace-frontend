import { Button, ConfigProvider, Empty } from 'antd';
import { PlusOutlined, SmileOutlined } from '@ant-design/icons';
import QuestCard from '@/components/QuestTabs/QuestCard/QuestCard';
import Link from 'next/link';
import { IQuest } from '@/app/types/quest-interfaces';
import { uid } from '@/lib/utils/utils';

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
            icon={<PlusOutlined/>}
        >
            Создать квест
        </Button>
    </ConfigProvider>
);

export const customizedEmpty = () => (
    <Empty
        image={<SmileOutlined style={{ fontSize: 48, opacity: 0.5 }} />}
        description={
            <span>
                Квесты не найдены
                <br />
                Попробуйте{' '}
                <Link
                    className={'create-quest__button'}
                    href={'/quest/create'}
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
            <QuestCard props={quest} key={uid()}/>
    );
}
