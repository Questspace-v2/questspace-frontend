import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import Footer from '@/components/Footer/Footer';
import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import dynamic from 'next/dynamic';

const DynamicCreateQuest = dynamic(() => import('@/components/CreateQuest/CreateQuest'), {ssr: false})

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
            <Footer />

        </>
    );
}
