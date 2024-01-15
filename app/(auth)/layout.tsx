import React from 'react';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import { manrope, robotoFlex } from '@/lib/fonts';

import './global.css';

export const metadata = {
    title: 'Questspace',
    description: 'Developed and designed by mathmech',
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
