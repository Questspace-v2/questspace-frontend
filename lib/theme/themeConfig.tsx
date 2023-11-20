// theme/themeConfig.ts
import type { ThemeConfig } from 'antd';
import { Manrope, Roboto_Flex } from 'next/font/google';

export const manrope = Manrope({
    style: 'normal',
    subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
    weight: ['400', '500', '700'],
});

const robotoFlex = Roboto_Flex({
    style: 'normal',
    subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
    weight: ['700'],
});

const theme: ThemeConfig = {
    token: {
        fontFamily: manrope.style.fontFamily,
        fontSize: 14,
    },
    components: {
        Typography: {
            fontFamily: robotoFlex.style.fontFamily,
        },
    },
};

export default theme;
