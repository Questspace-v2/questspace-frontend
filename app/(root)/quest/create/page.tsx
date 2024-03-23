import CreateQuest from '@/components/CreateQuest/CreateQuest';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import Footer from '@/components/Footer/Footer';
import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export default async function CreateQuestPage() {
    const session = await getServerSession();

    if (!session || !session.user) {
        redirect('/auth');
    }

    return (
        <>
            <Header isAuthorized/>
            <Body>
                <CreateQuest />
            </Body>
            <Footer />

        </>
    );
}
