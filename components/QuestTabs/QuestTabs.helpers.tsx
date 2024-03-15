import { Button, ConfigProvider, Empty } from 'antd';
import { PlusOutlined, SmileOutlined } from '@ant-design/icons';

const selectTab = ['all-quests', 'my-quests', 'created-quests'] as const;
export type SelectTab = (typeof selectTab)[number];


// @ts-expect-error мы точно знаем, что в SelectTab string
export const isSelectTab = (x: string): x is SelectTab => selectTab.includes(x);

export const createQuestButton = (
    <ConfigProvider>
        <Button
            className={'create-quest-button'}
            type={'link'}
            href={'/quest/create'}
            icon={<PlusOutlined style={{ color: '#1890FF' }} />}
            style={{ color: '#1890FF' }}
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
        }}
        imageStyle={{ height: 'auto' }}
    />
);

let count = 0;
export function getQuests(tab: SelectTab) {
    console.log(++count, tab);
    return customizedEmpty;
}
