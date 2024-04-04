import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import dynamic from 'next/dynamic';

const DynamicCreateQuest = dynamic(() => import('@/components/CreateQuest/CreateQuest'), {ssr: false})

const DynamicFooter = dynamic(() => import('@/components/Footer/Footer'), {
    ssr: false,
})

export default async function CreateQuestPage() {
    const session = await getServerSession();

    if (!session || !session.user) {
        redirect('/auth');
    }

    return (
        <>
            <Header isAuthorized/>
            <Body>
                <DynamicCreateQuest />
            </Body>
            <DynamicFooter />
        </>
    );
}
