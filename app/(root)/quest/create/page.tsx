import CreateQuest from '@/components/CreateQuest/CreateQuest';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import Footer from '@/components/Footer/Footer';
import React from 'react';
import { getCurrentIUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function CreateQuestPage() {
    const currentIUser = await getCurrentIUser();

    if (!currentIUser) {
        redirect('/auth');
    }

    return (
        <>
            <Header user={currentIUser}/>
            <Body>
                <CreateQuest />
            </Body>
            <Footer />

        </>
    );
}
