import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { manrope, robotoFlex } from '@/lib/fonts';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import NextAuthProvider from '@/components/NextAuthProvider/NextAuthProvider';
import { ConfigProvider } from 'antd';
import theme from '@/lib/theme/themeConfig';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import Background from '@/components/Background/Background';
import { FRONTEND_URL } from '@/app/api/client/constants';
import { ThemeProvider } from 'next-themes';

import '../(root)/global.scss';
import '../main.scss';


export const metadata: Metadata = {
    metadataBase: new URL(FRONTEND_URL),
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

export default async function RootLayout({ children }: React.PropsWithChildren) {
    const session = await getServerSession(authOptions);

    return (
        <html lang="ru" suppressHydrationWarning>
        <body className={`${manrope.variable} ${robotoFlex.variable}`}>
        <NextAuthProvider session={session}>
            <ThemeProvider>
                <AntdRegistry>
                    <ConfigProvider theme={theme}>
                        <div className={'App'}>
                            <Background type={'page'} />
                            {children}
                        </div>
                    </ConfigProvider>
                </AntdRegistry>
            </ThemeProvider>
        </NextAuthProvider>
        </body>
        </html>
    );
}
