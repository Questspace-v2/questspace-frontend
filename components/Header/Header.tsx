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
                <Logotype width={146} type={'text'} style={pointerCursor} />
                <HeaderAvatar />
            </div>
        </div>
    );
}
