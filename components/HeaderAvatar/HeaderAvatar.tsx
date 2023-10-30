import React, { useState } from 'react';
import { Avatar, Dropdown, MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import './HeaderAvatar.css';

export default function HeaderAvatar() {
    const [open, setOpen] = useState(false);
    const exitStyle: React.CSSProperties = {
        color: 'var(--quit-color)',
    };
    const openClassName: string = open ? 'header-dropdown_open' : '';

    const handleMenuClick: MenuProps['onClick'] = () => {
        setOpen(false);
    };

    const handleOpenChange = (flag: boolean) => {
        setOpen(flag);
    };

    const items: MenuProps['items'] = [
        {
            label: 'Мой профиль',
            key: '1',
        },
        {
            label: 'Выйти',
            key: '2',
            style: exitStyle,
        },
    ];

    return (
        <div className={`header-avatar__frame`}>
            <Dropdown
                className={'header-dropdown'}
                menu={{
                    items,
                    onClick: handleMenuClick,
                }}
                onOpenChange={handleOpenChange}
                open={open}
                placement={'bottomRight'}
                openClassName={openClassName}
            >
                <a onClick={e => e.preventDefault()}>
                    <Avatar
                        className={'header-avatar__image'}
                        alt={'avatar'}
                        shape={'circle'}
                        src={'https://api.dicebear.com/7.x/notionists/svg'}
                        draggable={false}
                    />
                    <DownOutlined />
                </a>
            </Dropdown>
        </div>
    );
}
