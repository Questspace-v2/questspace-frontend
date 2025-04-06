'use client'

import React, { useEffect, useState } from 'react';
import { Dropdown, MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import ThemeChanger from '@/components/ThemeChanger/ThemeChanger';


export default function HeaderAvatar() {
    const { data: session, update } = useSession();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible') {
                await update();
            }
        }
        window.addEventListener('visibilitychange', handleVisibilityChange);
        return () =>
            window.removeEventListener("visibilitychange", handleVisibilityChange, false);
    }, [update]);

    useEffect(() => {
        const handleOnline = async () => {
            await update();
        }
        window.addEventListener('online', handleOnline);
    }, [update]);

    if (!session || !session.user) {
        return <div>Session is expired</div>;
    }
    const {image: avatarUrl} = session.user;
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
            } style={{color: 'var(--text-red)'}}>Выйти</Link>,
            key: '2',
        },
        {
            type: 'divider',
        },
        {
            key: '3',
            label: <ThemeChanger />,
        },
    ];

    return (
        <div className={`header-avatar__frame`} aria-disabled={false}>
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
        </div>
    );
}
