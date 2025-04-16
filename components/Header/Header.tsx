'use client';

import HeaderAvatar from '@/components/Header/HeaderAvatar/HeaderAvatar';
import Logotype from '@/components/Logotype/Logotype';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from 'antd';
import { getRedirectParams } from '@/lib/utils/utils';


const pointerCursor: CSSProperties = {
    cursor: 'pointer',
};

interface HeaderProps {
    isAuthorized: boolean
}

export default function Header({isAuthorized} : HeaderProps) {
    const redirectParams = getRedirectParams();
    const isValidRedirect = redirectParams.get('route') === 'quest';
    const [lastScrollY, setLastScrollY] = useState(0);
    const headerRef = useRef<HTMLElement>(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Определяем, скроллим вниз или вверх
            const scrollingDown = currentScrollY > lastScrollY;

            // Показываем хэдер если:
            // 1. Скроллим вверх
            // 2. Мы в самом верху страницы
            // 3. Мы еще не проскроллили высоту хэдера
            if (!scrollingDown || currentScrollY < headerHeight || currentScrollY <= 0) {
                headerRef?.current?.classList.remove('page-header__hidden');
            } else {
                // Скрываем только если скроллим вниз И проскроллили больше чем высота хэдера
                headerRef?.current?.classList.add('page-header__hidden');
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY, headerHeight]);

    return (
        <header className={'page-header'} ref={headerRef}>
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