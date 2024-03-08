import HeaderAvatar from '@/components/HeaderAvatar/HeaderAvatar';
import './Header.css';
import Logotype from '@/components/Logotype/Logotype';
import { CSSProperties } from 'react';

const pointerCursor: CSSProperties = {
    cursor: 'pointer',
};
export default function Header() {
    return (
        <div className={'page-header'}>
            <div className={'page-header__items'}>
                <a href={'/'} tabIndex={0} aria-label={'Main page'}>
                    <Logotype width={146} type={'text'} style={pointerCursor} />
                </a>
                <HeaderAvatar />
                {/* <Link className={'page-header__auth-link'} href={'/auth'}>Войти</Link> */}
            </div>
        </div>
    );
}
