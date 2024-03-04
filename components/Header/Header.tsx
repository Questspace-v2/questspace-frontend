// eslint-disable-next-line @typescript-eslint/no-unused-vars
import HeaderAvatar from '@/components/HeaderAvatar/HeaderAvatar';
import './Header.css';
import Logotype from '@/components/Logotype/Logotype';
import { CSSProperties } from 'react';
import Link from 'next/link';

const pointerCursor: CSSProperties = {
    cursor: 'pointer',
};
export default function Header() {
    return (
        <div className={'page-header'}>
            <div className={'page-header__items'}>
                <Logotype width={146} type={'text'} style={pointerCursor} />
                {/* <HeaderAvatar /> */}
                <Link className={'page-header__auth-link'} href={'/auth'}>Войти</Link>
            </div>
        </div>
    );
}
