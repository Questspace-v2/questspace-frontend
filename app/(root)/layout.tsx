import React from 'react';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import { manrope } from '@/theme/themeConfig';
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
function RootLayout({ children }: React.PropsWithChildren) {
    return (
        <html lang="en">
            <body className={manrope.className}>
                <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
            </body>
        </html>
    );
}
export default RootLayout;
