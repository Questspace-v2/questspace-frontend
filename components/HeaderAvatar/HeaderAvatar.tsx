'use client'

import React, { CSSProperties, useState } from 'react';
import { Avatar, ConfigProvider, Dropdown, MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import './HeaderAvatar.css';

export default function HeaderAvatar() {
    const [open, setOpen] = useState(false);
    const exitStyle: CSSProperties = {
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
            <ConfigProvider theme={{ token: { borderRadius: 2 } }}>
                <Dropdown
                    className={'header-avatar__dropdown'}
                    menu={{
                        items,
                        onClick: handleMenuClick,
                    }}
                    onOpenChange={handleOpenChange}
                    open={open}
                    placement={'bottomRight'}
                    openClassName={openClassName}
                >
                    <button type={'button'} className={'header-avatar__button'}>
                        <Avatar
                            className={'header-avatar__image'}
                            alt={'avatar'}
                            shape={'circle'}
                            src={'https://api.dicebear.com/7.x/thumbs/svg'}
                            draggable={false}
                        />
                        <DownOutlined />
                    </button>
                </Dropdown>
            </ConfigProvider>
        </div>
    );
}
