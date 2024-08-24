import localFont from 'next/font/local';

export const manrope = localFont({
    src: './Manrope.woff2',
    style: 'normal',
    variable: '--font-manrope',
    display: 'swap',
    fallback: ['sans-serif'],
});

export const robotoFlex = localFont({
    src: './RobotoFlex.woff2',
    style: 'normal',
    weight: '700',
    variable: '--font-robotoflex',
    display: 'swap',
    fallback: ['Helvetica'],
});
