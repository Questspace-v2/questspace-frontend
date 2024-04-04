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

export const metadata: Metadata = {
    title: 'Квестспейс',
    description: 'Разработано и спроектировано МатМехом',
    icons: [{ rel: "icon", url: `/favicon.ico` }]
};

export default async function RootLayout({ children }: React.PropsWithChildren) {
    const session = await getServerSession(authOptions);

    return (
        <html lang="ru">
            <body className={`${manrope.variable} ${robotoFlex.variable}`}>
                <NextAuthProvider session={session}>
                    <AntdRegistry>
                        <ConfigProvider theme={theme}>
                            <div className={'App'}>
                                {children}
                            </div>
                        </ConfigProvider>
                    </AntdRegistry>
                </NextAuthProvider>
            </body>
        </html>
    );
}
