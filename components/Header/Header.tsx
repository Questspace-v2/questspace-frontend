import HeaderAvatar from '@/components/HeaderAvatar/HeaderAvatar';
import './Header.css';
import Logotype from '@/components/Logotype/Logotype';
import { CSSProperties } from 'react';
import Link from 'next/link';
import { Button } from 'antd';

const pointerCursor: CSSProperties = {
    cursor: 'pointer',
};
export default function Header({isAuthorized} : {isAuthorized: boolean}) {
    return (
        <div className={'page-header'}>
            <div className={'page-header__items'}>
                <Link href={'/'}>
                    <Logotype width={146} type={'text'} style={pointerCursor} />
                </Link>
                {isAuthorized ?
                    <HeaderAvatar />
                    :
                    <Link className={'page-header__auth-link'} href={'/auth'}>
                        <Button type={'link'} style={{fontWeight: 700}}>Войти</Button>
                    </Link>
                }
            </div>
        </div>
    );
}
