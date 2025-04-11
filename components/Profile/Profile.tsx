'use client'

import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';

import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import EditProfile from '@/components/Profile/EditProfile/EditProfile';
import ExitButton from '@/components/ExitButton/ExitButton';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import AvatarStub from './AvatarStub/AvatarStub';

export default function Profile() {
    const {data: session} = useSession();
    const username = session?.user.name;
    const greetings = `Привет, ${username ? `@${username}` : 'Аноним'}!`;
    const { xs } = useBreakpoint();

    return (
        <ContentWrapper>
            <div className={'profile__content-wrapper'}>
                {
                    session?.user.image ?
                    <Image className={'avatar__image'}
                        alt={'avatar'}
                        src={session.user.image}
                        width={xs ? 96 : 160}
                        height={xs ? 96 : 160}
                        style={{borderRadius: '80px'}}
                        draggable={'false'}
                    /> :
                    <AvatarStub width={xs ? 96 : 160} height={xs ? 96 : 160} />
                }
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
