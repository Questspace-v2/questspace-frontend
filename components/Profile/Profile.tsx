'use client'

import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';

import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import EditProfile from '@/components/Profile/EditProfile/EditProfile';
import ExitButton from '@/components/ExitButton/ExitButton';
import Image from 'next/image';
import { Session } from 'next-auth';
import { useState } from 'react';

interface ProfileProps {
    session: Session | null;
}

const ERROR_SRC = 'https://storage.yandexcloud.net/questspace-img/assets/error-src.png';

export default function Profile({ session }: ProfileProps) {
    const { xs } = useBreakpoint();
    const username = session?.user.name ?? 'Аноним';
    const [src, setSrc] = useState<string>(session?.user.image ?? ERROR_SRC);

    const greetings = `Привет, @${username}!`;

    return (
        <ContentWrapper>
            <div className={'profile__content-wrapper'}>
                <Image className={'avatar__image'}
                    alt={'avatar'}
                    src={src}
                    width={xs ? 96 : 160}
                    height={xs ? 96 : 160}
                    style={{ borderRadius: '80px' }}
                    draggable={'false'}
                    onError={() => setSrc(ERROR_SRC)}
                />
                <div className={'profile-information'}>
                    <h1 className={'roboto-flex-header responsive-header-h1'}>{greetings}</h1>
                    <div className={'profile-information__buttons'}>
                        {session?.user && <EditProfile session={session} />}
                        <ExitButton />
                    </div>
                </div>
            </div>
        </ContentWrapper>
    );
}
