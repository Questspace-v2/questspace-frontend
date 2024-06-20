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
    title: 'Квестспейс',
    description: 'Разработано и спроектировано МатМехом'
};

const DynamicFooter = dynamic(() => import('@/components/Footer/Footer'), {
    ssr: false,
})

export default async function RootLayout({ children }: React.PropsWithChildren) {
    const session = await getServerSession(authOptions);


    return (
        <html lang="ru">
        <head>
            <link rel="apple-touch-icon" sizes="180x180" href="../icon-apple-touch.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="../icon32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="../icon16.png" />
            <link rel="mask-icon" href="../icon-safari.svg" color="#5bbad5" />
            <meta name="msapplication-TileColor" content="#428df4" />
            <meta name="theme-color" content="#ffffff" />
        </head>
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
