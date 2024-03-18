'use client'

import { Avatar } from 'antd';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';

import './Profile.css';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import EditProfile from '@/components/EditProfile/EditProfile';
import ExitButton from '@/components/ExitButton/ExitButton';
import userMock from '@/app/api/__mocks__/User.mock';
import { User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

interface ProfileProps {
    user: User & {
        id: string,
        accessToken: JWT
    } | undefined
}

export default function Profile({user}: ProfileProps) {
    const greetings = `Привет, @${user?.name}!`;
    const { xs } = useBreakpoint();

    return (
        <ContentWrapper>
            <div className={'profile__content-wrapper'}>
                <Avatar
                    className={'avatar__image'}
                    alt={'avatar'}
                    shape={'circle'}
                    src={userMock.avatar_url}
                    draggable={false}
                    /* на самом деле размер берется (size - 2) */
                    size={xs ? 98 : 162}
                    style={{flexShrink: 0}}
                />

                <div className={'profile-information'}>
                    <h1 className={'roboto-flex-header responsive-header-h1'}>{greetings}</h1>
                    <div className={'profile-information__buttons'}>
                        <EditProfile />
                        <ExitButton />
                    </div>
                </div>
            </div>
        </ContentWrapper>
    );
}
