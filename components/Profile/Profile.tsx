'use client'

import React, { CSSProperties } from 'react';
import { Avatar } from 'antd';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';

import './Profile.css';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import EditProfile from '@/components/EditProfile/EditProfile';
import ExitButton from '@/components/ExitButton/ExitButton';

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
                        <EditProfile />
                        <ExitButton />
                    </div>
                </div>
            </div>
        </ContentWrapper>
    );
}
