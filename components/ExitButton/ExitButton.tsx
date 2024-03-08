import { Button, ConfigProvider } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import React from 'react';

interface ExitButtonProps {
    block?: boolean;
}

export default function ExitButton(props: ExitButtonProps) {
    const { block } = props;
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorText: 'var(--quit-color)',
                    colorPrimaryHover: 'var(--quit-color)',
                },
            }}
        >
            <Button
                className={'exit__button'}
                size={'middle'}
                icon={<LogoutOutlined />}
                style={{borderRadius: '2px'}}
                block={block}
            >
                Выйти
            </Button>
        </ConfigProvider>
    );
}
