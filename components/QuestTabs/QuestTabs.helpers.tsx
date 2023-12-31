import { Button, ConfigProvider, Empty } from 'antd';
import { PlusOutlined, SmileOutlined } from '@ant-design/icons';

export const createQuestButton = (
    <ConfigProvider>
        <Button
            className={'create-quest-button'}
            type={'link'}
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

export function getQuests() {
    return customizedEmpty;
}
