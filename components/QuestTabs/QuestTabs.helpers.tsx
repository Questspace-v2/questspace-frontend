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
        className={'empty__quests-not-found'}
        image={<SmileOutlined />}
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
    />
);

export function wrapInCard(quest: IQuest) {
    return (
            <QuestCard props={quest} key={uid()}/>
    );
}
