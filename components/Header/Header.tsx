'use client';

import HeaderAvatar from '@/components/Header/HeaderAvatar/HeaderAvatar';
import Logotype from '@/components/Logotype/Logotype';
import { CSSProperties } from 'react';
import Link from 'next/link';
import { Button } from 'antd';
import { getRedirectParams } from '@/lib/utils/utils';
import { Session } from 'next-auth';


const pointerCursor: CSSProperties = {
    cursor: 'pointer',
};

interface HeaderProps {
    session: Session | null;
}

export default function Header({ session } : HeaderProps) {
    const redirectParams = getRedirectParams();
    const isValidRedirect = redirectParams.get('route') === 'quest';

    return (
        <header className={'page-header'}>
            <div className={'page-header__items'}>
                <Link href={'/'}>
                    <Logotype width={146} type={'text'} style={pointerCursor} />
                </Link>
                {session?.user ?
                    <HeaderAvatar session={session} />
                    :
                    <Link className={'page-header__auth-link'} href={isValidRedirect ? `/auth?${redirectParams.toString()}` : '/auth'}>
                        <Button type={'link'} style={{fontWeight: 700}}>Войти</Button>
                    </Link>
                }
            </div>
        </header>
    );
}
