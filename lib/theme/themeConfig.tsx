// theme/themeConfig.ts
import type { ThemeConfig } from 'antd';
import { manrope } from '@/lib/fonts';

const theme: ThemeConfig = {
    token: {
        fontFamily: manrope.style.fontFamily,
        fontSize: 14,
        colorPrimary: '#1890FF',
        colorTextBase: '#262626',
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
        Button: {
            borderRadius: 2,
            borderRadiusLG: 2,
        }
    },
};

export const redOutlinedButton: ThemeConfig = {
    token: {
        colorText: '#FF4D4F',
            colorPrimaryHover: '#FF4D4F',
            colorPrimaryActive: '#FF4D4F'
    },
}

export const blueOutlinedButton: ThemeConfig = {
    token: {
        colorText: '#1890FF',
        colorPrimaryHover: '#1890FF',
        colorPrimaryActive: '#1890FF'
    },
}

export default theme;
