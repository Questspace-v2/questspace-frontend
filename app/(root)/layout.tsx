import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { manrope, robotoFlex } from '@/lib/fonts';
import { Metadata } from 'next';

import './global.css';
import { getServerSession } from 'next-auth';
import NextAuthProvider from '@/components/NextAuthProvider/NextAuthProvider';
import { ConfigProvider } from 'antd';
import theme from '@/lib/theme/themeConfig';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
    metadataBase: new URL('https://questspace.fun'),
    keywords: ['Квестспейс', 'Questspace', 'Квест', 'Матмех', 'Мат-мех'],
    title: {
        default: 'Квестспейс',
        template: `%s | Квестспейс`
    },
    openGraph: {
        description: 'Веб-приложение для организации и проведения квестов',
        images: ['']
    },
};

const DynamicFooter = dynamic(() => import('@/components/Footer/Footer'), {
    ssr: false,
})

export default async function RootLayout({ children }: React.PropsWithChildren) {
    const session = await getServerSession(authOptions);

    return (
        <html lang="ru">
        <body className={`${manrope.variable} ${robotoFlex.variable}`}>
        <NextAuthProvider session={session}>
            <AntdRegistry>
                <ConfigProvider theme={theme}>
                    <div className={'App'}>
                        <Header isAuthorized={Boolean(session?.user)} />
                        <Body>
                            {children}
                        </Body>
                        <DynamicFooter />
                    </div>
                </ConfigProvider>
            </AntdRegistry>
        </NextAuthProvider>
        </body>
        </html>
    );
}
