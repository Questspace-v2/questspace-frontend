import React from 'react';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import { manrope, robotoFlex } from '@/lib/fonts';
import { Metadata } from 'next';

import './global.css';

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
                <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
            </body>
        </html>
    );
}
