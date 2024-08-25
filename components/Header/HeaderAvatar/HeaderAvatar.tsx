'use client'

import React, { useState } from 'react';
import { ConfigProvider, Dropdown, MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';


export default function HeaderAvatar() {
    const {image: avatarUrl} = useSession().data!.user;
    const [open, setOpen] = useState(false);
    const openClassName: string = open ? 'header-dropdown_open' : '';

    const handleMenuClick: MenuProps['onClick'] = () => {
        setOpen(false);
    };

    const handleOpenChange = (flag: boolean) => {
        setOpen(flag);
    };

    const items: MenuProps['items'] = [
        {
            label: <Link href='/'>Мой профиль</Link>,
            key: '1',
        },
        {
            label: <Link href='/' className={'dropdown__exit-button'} onClick={
                async (event) => {
                    event.preventDefault();
                    await signOut()}
            }>Выйти</Link>,
            key: '2',
        },
    ];

    return (
        <div className={`header-avatar__frame`} aria-disabled={false}>
            <ConfigProvider theme={{ token: { borderRadius: 2 }}}>
                <Dropdown
                    rootClassName={'header-avatar__dropdown'}
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
                            src={avatarUrl!}
                            priority
                        />
                        <DownOutlined />
                    </button>
                </Dropdown>
            </ConfigProvider>
        </div>
    );
}
