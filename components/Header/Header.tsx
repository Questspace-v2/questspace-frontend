import HeaderAvatar from '@/components/HeaderAvatar/HeaderAvatar';
import './Header.css';
import Logotype from '@/components/Logotype/Logotype';
import { CSSProperties } from 'react';
import { IUser } from '@/app/types/user-interfaces';
import Link from 'next/link';
import { getServerSession } from 'next-auth';

const pointerCursor: CSSProperties = {
    cursor: 'pointer',
};
export default function Header({isAuthorized} : {isAuthorized: boolean}) {
    const session = getServerSession();
    return (
        <div className={'page-header'}>
            <div className={'page-header__items'}>
                <Link href={'/'}>
                    <Logotype width={146} type={'text'} style={pointerCursor} />
                </Link>

                {isAuthorized && <HeaderAvatar />}
                {/* <Link className={'page-header__auth-link'} href={'/auth'}>Войти</Link> */}
            </div>
        </div>
    );
}
