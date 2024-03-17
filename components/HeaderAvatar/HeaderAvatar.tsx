'use client'

import React, { CSSProperties, useState } from 'react';
import { ConfigProvider, Dropdown, MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import './HeaderAvatar.css';
import userMock from '@/app/api/__mocks__/User.mock';
import Image from 'next/image';

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
            label: <a href='/'>Мой профиль</a>,
            key: '1',
        },
        {
            label: <a href='/auth'>Выйти</a>,
            key: '2',
            style: exitStyle,
        },
    ];

    return (
        <div className={`header-avatar__frame`} aria-disabled={false}>
            <ConfigProvider theme={{ token: { borderRadius: 2 }, components: { Dropdown: {paddingBlock: 0} }}}>
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
                        <Image
                            className={'header-avatar__image'}
                            alt={'avatar'}
                            width={32}
                            height={32}
                            style={{borderRadius: '16px'}}
                            src={userMock.avatar_url}
                        />
                        <DownOutlined />
                    </button>
                </Dropdown>
            </ConfigProvider>
        </div>
    );
}
