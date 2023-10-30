import React from 'react';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import { manrope } from '@/theme/themeConfig';
import './global.css';

export const metadata = {
    title: 'Questspace',
    description: 'Developed and designed by mathmech',
};

export default function RootLayout({ children }: React.PropsWithChildren) {
    return (
        <html lang="en">
            <body className={manrope.className}>
                <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
            </body>
        </html>
    );
}
