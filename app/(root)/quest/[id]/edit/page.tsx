import { getServerSession } from 'next-auth';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import React from 'react';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import authOptions from '@/app/api/auth/[...nextauth]/auth';

const DynamicFooter = dynamic(() => import('@/components/Footer/Footer'), {
    ssr: false,
})

export default async function EditQuestPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect('/auth');
    }

    return (
        <>
            <Header isAuthorized/>
            <Body />
            <DynamicFooter />
        </>
    );
}
