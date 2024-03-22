import Quest from '@/components/Quest/Quest';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import Footer from '@/components/Footer/Footer';
import React from 'react';
import { BACKEND_URL } from '@/app/api/client/constants';
import { IQuest } from '@/app/types/quest-interfaces';
import { getQuestById } from '@/app/api/api';
import { getCurrentIUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';

export default async function QuestPage({params}: {params: {id: string}}) {
    // const questData  = await getQuestById(params.id);
    const session = await getServerSession();
    const questData  = await fetch(`${BACKEND_URL}/quest/${params.id}`, {headers: {'authorization': `Bearer ${session?.accessToken}`}}).then(response => response.json()) as IQuest;
    const currentIUser = await getCurrentIUser();

    if (!currentIUser) {
        redirect('/auth');
    }

    return (
        <>
            <Header user={currentIUser}/>
            <Body>
                <Quest props={questData}/>
            </Body>
            <Footer />
        </>
    );
}
