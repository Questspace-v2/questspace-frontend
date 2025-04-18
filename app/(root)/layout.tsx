import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { manrope, robotoFlex } from '@/lib/fonts';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import NextAuthProvider from '@/components/NextAuthProvider/NextAuthProvider';
import { ConfigProvider } from 'antd';
import theme from '@/lib/theme/themeConfig';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import dynamic from 'next/dynamic';
import mainMetadata from '@/app/metadata';
import { ThemeProvider } from 'next-themes';

import './global.scss';
import '../main.scss';


export const metadata: Metadata = mainMetadata;

const DynamicFooter = dynamic(() => import('@/components/Footer/Footer'), {
    ssr: true,
})

export default async function RootLayout({ children }: React.PropsWithChildren) {
    const session = await getServerSession(authOptions);
    const isAuthorized = Boolean(session?.user);

    return (
        <html lang="ru" suppressHydrationWarning>
        <body className={`${manrope.variable} ${robotoFlex.variable}`}>
        <NextAuthProvider session={session}>
            <ThemeProvider>
                <AntdRegistry>
                    <ConfigProvider theme={theme}>
                        <div className={'App'}>
                            <Header isAuthorized={isAuthorized}/>
                            <Body>
                                {children}
                            </Body>
                            <DynamicFooter />
                        </div>
                    </ConfigProvider>
                </AntdRegistry>
            </ThemeProvider>
        </NextAuthProvider>
        </body>
        </html>
    );
}
