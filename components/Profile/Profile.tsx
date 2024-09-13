'use client'

import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';

import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import EditProfile from '@/components/Profile/EditProfile/EditProfile';
import ExitButton from '@/components/ExitButton/ExitButton';
import { IUser } from '@/app/types/user-interfaces';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function Profile() {
    const {name: username, image: avatarUrl, id} = useSession().data!.user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user: IUser = {
        username: username!, avatar_url: avatarUrl!, id
    };
    const greetings = `Привет, @${username}!`;
    const { xs } = useBreakpoint();

    return (
        <ContentWrapper>
            <div className={'profile__content-wrapper'}>
                <Image className={'avatar__image'}
                       alt={'avatar'}
                       src={avatarUrl!}
                       width={xs ? 96 : 160}
                       height={xs ? 96 : 160}
                       style={{borderRadius: '80px'}}
                       draggable={'false'}
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
