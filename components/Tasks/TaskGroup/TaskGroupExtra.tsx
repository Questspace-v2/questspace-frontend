'use client';

import React, { useState } from 'react';
import { Button, ConfigProvider, Dropdown, MenuProps } from 'antd';
import { blueOutlinedButton, redOutlinedButton } from '@/lib/theme/themeConfig';
import { DeleteOutlined, EditOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';

export default function TaskGroupExtra({edit}: {edit: boolean}) {
    const [open, setOpen] = useState(false);

    const handleMenuClick: MenuProps['onClick'] = () => {
        setOpen(false);
    };

    const handleOpenChange = (flag: boolean) => {
        setOpen(flag);
    };

    const items: MenuProps['items'] = [
        {
            label: <><EditOutlined/>Изменить название</>,
            key: '1',
        },
        {

            label: <><PlusOutlined/>Добавить задачу</>,
            key: '2',
        },
        {

            label: <><DeleteOutlined/>Удалить раздел</>,
            key: '3',
        },
    ];

    if (edit) {
        return (
            <div className={'task-group__collapse-buttons'}>
                <ConfigProvider theme={blueOutlinedButton}>
                    <Button><EditOutlined/>Изменить название</Button>
                    <Button><PlusOutlined/>Добавить задачу</Button>
                </ConfigProvider>
                <ConfigProvider theme={redOutlinedButton}>
                    <Button><DeleteOutlined/>Удалить раздел</Button>
                </ConfigProvider>
                <Dropdown
                    rootClassName={'task-group-extra__dropdown'}
                    className={'task-group-extra__burger-button'}
                    menu={{
                        items,
                        onClick: handleMenuClick,
                    }}
                    onOpenChange={handleOpenChange}
                    open={open}
                    placement={'bottomRight'}
                    destroyPopupOnHide
                >
                    <Button><MenuOutlined/></Button>
                </Dropdown>

            </div>
        );
    }

    return null;
}
