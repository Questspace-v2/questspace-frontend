import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { manrope, robotoFlex } from '@/lib/fonts';

import './global.css';
import { Metadata } from 'next';
import SessionProvider from '@/components/SessionProvider/SessionProvider';
import { getServerSession } from 'next-auth';

export const metadata: Metadata = {
    title: 'Квестспейс',
    description: 'Разработано и спроектировано МатМехом',
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
