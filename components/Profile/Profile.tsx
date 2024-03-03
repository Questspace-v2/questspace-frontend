'use client'

import React, { CSSProperties } from 'react';
import { Avatar, Button, ConfigProvider } from 'antd';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';

import './Profile.css';
import { EditOutlined, LogoutOutlined } from '@ant-design/icons';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';

export default function Profile() {
    const defaultUsername = 'prikotletka';
    const greetings = `Привет, @${defaultUsername}!`;
    const { xs } = useBreakpoint();
    const avatarSize = xs ? '96px' : '160px';
    const avatarStyle: CSSProperties = {
        flexShrink: 0,
        width: avatarSize,
        height: avatarSize,
    };
    const borderStyle: CSSProperties = {
        borderRadius: '2px',
    };
    const exitStyle: React.CSSProperties =
        {
            color: 'var(--quit-color)',
        } && borderStyle;

    return (
        <ContentWrapper>
            <div className={'profile__wrapper'}>
                <Avatar
                    className={'avatar__image'}
                    alt={'avatar'}
                    shape={'circle'}
                    src={'https://api.dicebear.com/7.x/thumbs/svg'}
                    draggable={false}
                    style={avatarStyle}
                />
                <div className={'profile-information'}>
                    <h1 className={'profile-greetings'}>{greetings}</h1>
                    <div className={'profile-information__buttons'}>
                        <Button
                            className={'edit-profile-button'}
                            size={'middle'}
                            icon={<EditOutlined />}
                            style={borderStyle}
                        >
                            Редактировать профиль
                        </Button>
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorText: 'var(--quit-color)',
                                    colorPrimaryHover: 'var(--quit-color)',
                                },
                            }}
                        >
                            <Button
                                className={'exit-button'}
                                size={'middle'}
                                icon={<LogoutOutlined />}
                                style={exitStyle}
                            >
                                Выйти
                            </Button>
                        </ConfigProvider>
                    </div>
                </div>
            </div>
        </ContentWrapper>
    );
}
