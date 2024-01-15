import React from 'react';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import { manrope, robotoFlex } from '@/lib/fonts';
import { Metadata } from 'next';

import './global.css';
import { Providers } from '../redux/provider/provider';

export const metadata: Metadata = {
    title: 'Questspace',
    description: 'Developed and designed by mathmech',
    icons: {
        icon: '/favicon.ico',
        apple: '/favicon.ico',
    },
};
export default function RootLayout({ children }: React.PropsWithChildren) {
    return (
        <html lang="en">
            <body className={`${manrope.variable} ${robotoFlex.variable}`}>
                <Providers>
                    <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
                </Providers>
            </body>
        </html>
    );
}
