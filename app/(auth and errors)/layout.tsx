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
    metadataBase: new URL(process.env.NEXTAUTH_URL!),
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
        <html lang="ru">
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
