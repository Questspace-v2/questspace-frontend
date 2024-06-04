'use client'

import HeaderAvatar from '@/components/Header/HeaderAvatar/HeaderAvatar';
import Logotype from '@/components/Logotype/Logotype';
import { CSSProperties } from 'react';
import Link from 'next/link';
import { Button } from 'antd';
import { getRedirectParams } from '@/lib/utils/utils';

import './Header.css';

const pointerCursor: CSSProperties = {
    cursor: 'pointer',
};

interface HeaderProps {
    isAuthorized: boolean
}

export default function Header({isAuthorized} : HeaderProps) {
    const redirectParams = getRedirectParams();
    const isValidRedirect = redirectParams.get('route') === 'quest';

    return (
        <header className={'page-header'}>
            <div className={'page-header__items'}>
                <Link href={'/'}>
                    <Logotype width={146} type={'text'} style={pointerCursor} />
                </Link>
                {isAuthorized ?
                    <HeaderAvatar />
                    :
                    <Link className={'page-header__auth-link'} href={isValidRedirect ? `/auth?${redirectParams.toString()}` : '/auth'}>
                        <Button type={'link'} style={{fontWeight: 700}}>Войти</Button>
                    </Link>
                }
            </div>
        </header>
    );
}
