import { getServerSession } from 'next-auth';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import React from 'react';
import dynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';
import { isAllowedUser } from '@/lib/utils/utils';

const DynamicFooter = dynamic(() => import('@/components/Footer/Footer'), {
    ssr: false,
})

export default async function PlayQuestPage() {
    const session = await getServerSession();

    if (!session || !session.user) {
        redirect('/auth');
    }

    if (!isAllowedUser(session.user.id)) {
        notFound();
    }

    return (
        <>
            <Header isAuthorized/>
            <Body/>
            <DynamicFooter />
        </>
    );
}
