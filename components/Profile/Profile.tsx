'use client'

import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';

import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import EditProfile from '@/components/Profile/EditProfile/EditProfile';
import ExitButton from '@/components/ExitButton/ExitButton';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Profile() {
    const { data: session, update } = useSession();
    const { xs } = useBreakpoint();

    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible') {
                await update();
            }
        }
        window.addEventListener('visibilitychange', handleVisibilityChange);
        return () =>
            window.removeEventListener("visibilitychange", handleVisibilityChange, false);
    }, [update]);

    useEffect(() => {
        const handleOnline = async () => {
            await update();
        }
        window.addEventListener('online', handleOnline);
    }, [update]);

    if (!session || !session.user) {
        return <div>Session is expired</div>;
    }

    const { name: username, image: avatarUrl } = session.user;
    const greetings = `Привет, @${username}!`;

    return (
        <ContentWrapper>
            <div className={'profile__content-wrapper'}>
                <Image className={'avatar__image'}
                    alt={'avatar'}
                    src={avatarUrl!}
                    width={xs ? 96 : 160}
                    height={xs ? 96 : 160}
                    style={{ borderRadius: '80px' }}
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
