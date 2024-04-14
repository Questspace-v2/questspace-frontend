import HeaderAvatar from '@/components/Header/HeaderAvatar/HeaderAvatar';
import Logotype from '@/components/Logotype/Logotype';
import { CSSProperties } from 'react';
import Link from 'next/link';
import { Button } from 'antd';

import './Header.css';

const pointerCursor: CSSProperties = {
    cursor: 'pointer',
};

interface HeaderProps {
    isAuthorized: boolean,
    redirectParams?: string
}
export default function Header({isAuthorized, redirectParams} : HeaderProps) {
    return (
        <div className={'page-header'}>
            <div className={'page-header__items'}>
                <Link href={'/'}>
                    <Logotype width={146} type={'text'} style={pointerCursor} />
                </Link>
                {isAuthorized ?
                    <HeaderAvatar />
                    :
                    <Link className={'page-header__auth-link'} href={`/auth?${redirectParams}`}>
                        <Button type={'link'} style={{fontWeight: 700}}>Войти</Button>
                    </Link>
                }
            </div>
        </div>
    );
}
