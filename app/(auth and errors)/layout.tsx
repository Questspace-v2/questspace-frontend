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
            <link rel="apple-touch-icon" sizes="180x180" href="../icons/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="../icons/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="../icons/favicon-16x16.png" />
            <link rel="mask-icon" href="../icons/safari-pinned-tab.svg" color="#5bbad5" />
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
