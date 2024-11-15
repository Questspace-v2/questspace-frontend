import { ThemeConfig } from "antd";

const questTabsSelectThemeConfig: ThemeConfig = {
    components: {
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
        }
    }
};

export default questTabsSelectThemeConfig;