import Quest from '@/components/Quest/Quest';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import Footer from '@/components/Footer/Footer';
import React from 'react';
import { BACKEND_URL } from '@/app/api/client/constants';
import { IQuest } from '@/app/types/quest-interfaces';
import { getServerSession } from 'next-auth';

export default async function QuestPage({params}: {params: {id: string}}) {
    const session = await getServerSession();
    const questData  = await fetch(
        `${BACKEND_URL}/quest/${params.id}`, {
            headers: {'Authorization': `Bearer ${session?.accessToken}`}})
        .then(response => response.json()) as IQuest;

    return (
        <>
            <Header isAuthorized={Boolean(session)}/>
            <Body>
                <Quest props={questData}/>
            </Body>
            <Footer />
        </>
    );
}
