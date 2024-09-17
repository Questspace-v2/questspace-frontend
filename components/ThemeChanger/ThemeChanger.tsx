import { useTheme } from 'next-themes'
import { Radio, RadioChangeEvent } from 'antd';
import React from 'react';

export default function ThemeChanger() {
    const { theme, setTheme } = useTheme();

    const onChange = (e: RadioChangeEvent) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setTheme(e.target.value);
    }

    return (
        <div className={'theme-changer'}>
            <h4 className={'theme-changer__header'}>Тема</h4>
            <Radio.Group className={'theme-changer__radio-group'} value={theme} onChange={onChange}>
                <Radio value={'light'}>Светлая 🌝</Radio>
                <Radio value={'dark'}>Темная 🌚</Radio>
                <Radio value={'system'}>Как в системе 💻</Radio>
            </Radio.Group>
        </div>
    )
}
