import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { manrope, robotoFlex } from '@/lib/fonts';
import { Metadata } from 'next';

import '../(root)/global.css';
import { getServerSession } from 'next-auth';
import NextAuthProvider from '@/components/NextAuthProvider/NextAuthProvider';
import { ConfigProvider } from 'antd';
import theme from '@/lib/theme/themeConfig';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import Background from '@/components/Background/Background';

export const metadata: Metadata = {
    title: 'Квестспейс',
    description: 'Разработано и спроектировано МатМехом',
};

export default async function RootLayout({ children }: React.PropsWithChildren) {
    const session = await getServerSession(authOptions);

    return (
        <html lang="ru">
        <head>
            <link rel="icon" href="../favicon.ico" sizes="any" />
            <link rel="apple-touch-icon" sizes="180x180" href="../apple-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="../icon2.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="../icon1.png" />
            <link rel="mask-icon" href="../icon-safari.svg" color="#5bbad5" />
            <meta name="msapplication-TileColor" content="#428df4" />
            <meta name="theme-color" content="#ffffff" />
        </head>
        <body className={`${manrope.variable} ${robotoFlex.variable}`}>
        <NextAuthProvider session={session}>
            <AntdRegistry>
                <ConfigProvider theme={theme}>
                    <div className={'App'}>
                        <Background type={'page'} />
                        {children}
                    </div>
                </ConfigProvider>
                    </AntdRegistry>
                </NextAuthProvider>
            </body>
        </html>
    );
}
