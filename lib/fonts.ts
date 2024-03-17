import { Manrope } from 'next/font/google';
import localFont from 'next/font/local';

export const manrope = Manrope({
    style: 'normal',
    subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
    weight: ['400', '500', '700'],
    variable: '--font-manrope',
    display: 'swap',
});

export const robotoFlex = localFont({
    src: './RobotoFlex.woff2',
    style: 'normal',
    weight: '700',
    variable: '--font-robotoflex',
    display: 'swap',
    fallback: ['Helvetica'],
});
