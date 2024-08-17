import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import Link from 'next/link';
import { Button } from 'antd';
import Background from '@/components/Background/Background';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    metadataBase: new URL('https://questspace.fun'),
    title: {
        default: 'Квест не найден',
        template: `%s | Квестспейс`
    },
    openGraph: {
        description: 'Квест, который вы ищете, не существует',
        images: ['']
    },
};

export default function NotFound() {
    return (
        <>
            <Background type={'page'} />
            <section className={'page__not-found'}>
                <ContentWrapper className={'not-found__content-wrapper'}>
                    <h1 className={'roboto-flex-header'} style={{fontSize: '107px', color: 'var(--primary-color)'}}>404</h1>
                    <p>Мы как-то не рассчитывали, что квест зайдет настолько далеко...🤔</p>
                    <Link href={'/'}>
                        <Button type={'primary'}>Вернуться на главную</Button>
                    </Link>
                </ContentWrapper>
            </section>
        </>
    );
}
