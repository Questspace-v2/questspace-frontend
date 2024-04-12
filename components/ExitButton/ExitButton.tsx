import { Button, ConfigProvider } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import React from 'react';
import { signOut } from 'next-auth/react';

import './ExitButton.css';
import { redOutlinedButton } from '@/lib/theme/themeConfig';

interface ExitButtonProps {
    block?: boolean;
}

export default function ExitButton(props: ExitButtonProps) {
    const { block } = props;

    // должен чиститься state и совершаться signOut
    const handleClick = async () => {
        await signOut();
    }

    return (
        <ConfigProvider
            theme={redOutlinedButton}
        >
            <Button
                className={'exit__button'}
                size={'middle'}
                style={{borderRadius: '2px'}}
                block={block}
                /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
                onClick={handleClick}
            >
                <LogoutOutlined />
                Выйти
            </Button>
        </ConfigProvider>
    );
}
