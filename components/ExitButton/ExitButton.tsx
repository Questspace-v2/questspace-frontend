import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import React from 'react';
import { signOut } from 'next-auth/react';


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
        <Button
            className={'exit__button'}
            size={'middle'}
            danger
            style={{borderRadius: '2px'}}
            block={block}
            /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
            onClick={handleClick}
        >
            <LogoutOutlined />
            Выйти
        </Button>
    );
}
