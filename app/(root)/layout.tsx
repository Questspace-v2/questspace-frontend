import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { manrope, robotoFlex } from '@/lib/fonts';
import { Metadata } from 'next';

import './global.css';
import Providers from '@/components/Providers/Providers';


export const metadata: Metadata = {
    title: 'Квестспейс',
    description: 'Разработано и спроектировано МатМехом',
    icons: {
        icon: '/favicon.ico',
        apple: '/favicon.ico',
    },
};
export default function RootLayout({ children }: React.PropsWithChildren) {
    return (
        <html lang="ru">
            <body className={`${manrope.variable} ${robotoFlex.variable}`}>
                <Providers>
                    <AntdRegistry>{children}</AntdRegistry>
                </Providers>
            </body>
        </html>
    );
}
