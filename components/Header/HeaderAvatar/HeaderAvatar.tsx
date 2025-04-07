'use client'

import React, { useState } from 'react';
import { Dropdown, MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import ThemeChanger from '@/components/ThemeChanger/ThemeChanger';
import { Session } from 'next-auth';

interface HeaderAvatarProps {
    session: Session | null;
}

const ERROR_SRC = 'https://storage.yandexcloud.net/questspace-img/assets/error-src.png';

export default function HeaderAvatar({ session }: HeaderAvatarProps) {
    const [open, setOpen] = useState(false);
    const [src, setSrc] = useState<string>(session?.user.image ?? ERROR_SRC);

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
                        src={src}
                        priority
                        onError={() => setSrc(ERROR_SRC)}
                    />
                    <DownOutlined />
                </button>
            </Dropdown>
        </div>
    );
}
