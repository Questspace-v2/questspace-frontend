import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { manrope, robotoFlex } from '@/lib/fonts';
import { Metadata } from 'next';

import './global.css';
import { getServerSession } from 'next-auth';
import SessionProvider from '@/components/SessionProvider/SessionProvider';

export const metadata: Metadata = {
    title: 'Квестспейс',
    description: 'Разработано и спроектировано МатМехом',
    icons: [{ rel: "icon", url: `/favicon.ico` }]
};

export default async function RootLayout({ children }: React.PropsWithChildren) {
    const session = await getServerSession();
    return (
        <html lang="ru">
            <body className={`${manrope.variable} ${robotoFlex.variable}`}>
                <SessionProvider session={session}>
                    <AntdRegistry>{children}</AntdRegistry>
                </SessionProvider>
            </body>
        </html>
    );
}
