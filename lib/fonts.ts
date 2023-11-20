import { Manrope, Roboto_Flex } from 'next/font/google';

export const manrope = Manrope({
    style: 'normal',
    subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
    weight: ['400', '500', '700'],
    variable: '--font-manrope',
    display: 'swap',
});

export const robotoFlex = Roboto_Flex({
    style: 'normal',
    subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
    weight: ['700'],
    variable: '--font-roboto-flex',
    display: 'swap',
});
