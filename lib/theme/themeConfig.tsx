// theme/themeConfig.ts
import type { ThemeConfig } from 'antd';
import { manrope, robotoFlex } from '@/lib/fonts';
import { Tabs } from 'antd';

const theme: ThemeConfig = {
    token: {
        fontFamily: manrope.style.fontFamily,
        fontSize: 14,
        colorPrimary: '#1890FF',
        screenXSMin: 320,
        screenXS: 320,
        screenXSMax: 639,
        screenSMMin: 640,
        screenSM: 640,
        screenSMMax: 959,
        screenMDMin: 960,
        screenMD: 960,
        screenLGMax: 1279,
        screenXL: 1280,
        screenXLMin: 1280,
    },
    components: {
        Typography: {
            fontFamily: robotoFlex.style.fontFamily,
        },
        Input: {
            borderRadiusSM: 2,
            borderRadiusXS: 2,
            borderRadiusLG: 2,
        },
        Tabs: {
            boxShadow: '0',
            boxShadowSecondary: '0',
            boxShadowTertiary: '0',
        },
    },
};

export default theme;
