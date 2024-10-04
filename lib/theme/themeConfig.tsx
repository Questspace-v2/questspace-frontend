// theme/themeConfig.ts
import type { ThemeConfig } from 'antd';
import { manrope } from '@/lib/fonts';

const theme: ThemeConfig = {
    cssVar: true,
    token: {
        fontFamily: manrope.style.fontFamily,
        fontSize: 14,
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
            borderRadius: 2,
            colorBgContainer: 'transparent',
            colorTextPlaceholder: 'var(--text-disabled)',
            colorBorder: 'var(--stroke-secondary)',
            colorText: 'var(--text-default)'
        },
        InputNumber: {
            borderRadiusSM: 2,
            borderRadiusXS: 2,
            borderRadiusLG: 2,
            colorBgContainer: 'transparent',
            colorTextPlaceholder: 'var(--text-disabled)',
            colorBorder: 'var(--stroke-secondary)',
            colorText: 'var(--text-default)'
        },
        Tabs: {
            itemColor: 'var(--text-default)',
            itemActiveColor: 'var(--text-blue)',
            itemSelectedColor: 'var(--text-blue)',
            inkBarColor: 'var(--text-blue)',
            colorBorderSecondary: 'var(--stroke-secondary)',
            boxShadow: '0',
            boxShadowSecondary: '0',
            boxShadowTertiary: '0',
        },
        Button: {
            colorPrimary: 'var(--text-blue)',
            defaultBorderColor: 'var(--stroke-secondary)',
            colorText: 'var(--text-default)',
            colorError: 'var(--text-red)',
            colorErrorHover: 'var(--text-red)',
            colorErrorBorderHover: 'var(--text-red)',
            defaultGhostColor: 'var(--text-blue)',
            defaultGhostBorderColor: 'var(--stroke-secondary)',
            colorBorder: 'var(--stroke-secondary)',
            colorLink: 'var(--text-blue)',
            borderRadius: 2,
            borderRadiusLG: 2,
            colorBgContainer: 'transparent',
            borderColorDisabled: 'var(--stroke-secondary)',
            colorBgContainerDisabled: 'var(--background-disabled)',
            colorTextDisabled: 'var(--text-disabled)',
        },
        Modal: {
            contentBg: 'var(--background-primary)',
            headerBg: 'transparent',
            footerBg: 'transparent',
            colorIcon: 'var(--icon-outlined-disabled)',
            colorIconHover: 'var(--icon-outlined-default)',
        },
        Table: {
            headerBg: 'var(--background-primary)',
            headerColor: 'var(--text-secondary)',
            footerBg: 'var(--background-primary)',
            footerColor: 'var(--text-secondary)',
            colorBgContainer: 'var(--background-primary)',
            borderColor: 'var(--stroke-secondary)',
            colorText: 'var(--text-default)',
            rowHoverBg: 'var(--background-secondary)',
        },
        Collapse: {
            colorText: 'var(--text-default)',
            colorTextHeading: 'var(--text-default)',
        },
        Form: {
            labelColor: 'var(--text-default)',
        },
        Dropdown: {
            borderRadiusSM: 2,
            borderRadiusXS: 2,
            borderRadiusLG: 2,
            colorBgElevated: 'var(--background-primary)',
            colorText: 'var(--text-default)',
            controlItemBgHover: 'var(--background-secondary)',
            colorSplit: 'var(--stroke-secondary)'
        },
        DatePicker: {
            activeBg: 'transparent',
            colorText: 'var(--text-default)',
            colorTextHeading: 'var(--text-default)',
            colorBgContainer: 'transparent',
            colorBgElevated: 'var(--background-primary)',
            colorBorder: 'var(--stroke-secondary)',
            colorPrimary: 'var(--background-blue)',
            colorPrimaryBorder: 'var(--text-blue)',
            colorTextDisabled: 'var(--text-disabled)',
            cellHoverBg: 'var(--background-secondary)',
            cellBgDisabled: 'var(--background-disabled)',
            controlItemBgActive: 'var(--background-blue)',
            colorIcon: 'var(--icon-outlined-disabled)',
            colorIconHover: 'var(--icon-outlined-secondary)',
            colorTextDescription: 'var(--icon-filled-secondary)',
            colorTextPlaceholder: 'var(--text-disabled)',
        },
        Radio: {
            colorPrimary: 'var(--icon-filled-blue)',
            colorText: 'var(--text-default)',
            buttonSolidCheckedBg: 'var(--text-default)',
        },
        Checkbox: {
            colorText: 'var(--text-default)',
            colorBgContainer: 'transparent',
            colorBorder: 'var(--stroke-secondary)'
        },
        Select: {
            colorTextPlaceholder: 'var(--text-blue)',
            colorPrimary: 'var(--text-blue)',
            colorPrimaryTextActive: 'var(--text-blue)',
            colorTextHeading: 'var(--text-blue)',
            fontWeightStrong: 400,
            colorIcon: 'var(--icon-outlined-blue)',
            colorIconHover: 'var(--icon-outlined-blue)',
            colorBgElevated: 'var(--background-primary)',
            colorText: 'var(--text-default)',
            optionSelectedBg: 'var(--background-blue)',
            optionActiveBg: 'var(--background-secondary)'
        },
        Message: {
            contentBg: 'var(--background-primary)',
            colorText: 'var(--text-default)',
            colorError: 'var(--icon-filled-red)',
            colorSuccess: 'var(--icon-filled-green)',
            colorInfo: 'var(--icon-filled-blue)',
            colorWarning: 'var(--icon-filled-yellow)',
        },
        Switch: {
            colorPrimary: 'var(--text-blue)',
        }
    },
};

export default theme;
