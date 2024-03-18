import { Button, ConfigProvider } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import React from 'react';
import navigate from '@/app/actions';
import { signOut } from 'next-auth/react';

interface ExitButtonProps {
    block?: boolean;
}

export default function ExitButton(props: ExitButtonProps) {
    const { block } = props;

    // должен чиститься state и совершаться signOut
    const handleClick = async () => {
        await signOut();
        await navigate('/auth');
    }

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
                /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
                onClick={handleClick}
            >
                Выйти
            </Button>
        </ConfigProvider>
    );
}
