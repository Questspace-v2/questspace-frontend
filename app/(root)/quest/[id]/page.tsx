import Quest from '@/components/Quest/Quest';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import Footer from '@/components/Footer/Footer';
import React from 'react';
import { BACKEND_URL } from '@/app/api/client/constants';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { notFound } from 'next/navigation';
import { IQuest } from '@/app/types/quest-interfaces';

async function fetchQuest({id, accessToken} : {id: string, accessToken?: string}) {
    const res = await fetch(
        `${BACKEND_URL}/quest/${id}`, {
            headers: {'Authorization': `Bearer ${accessToken}`}});
    if (!res.ok) return undefined
    return res.json()
}

export default async function QuestPage({params}: {params: {id: string}}) {
    const session = await getServerSession(authOptions);
    const questData = await fetchQuest({id: params.id, accessToken: session?.accessToken}) as IQuest | undefined;

    if (!questData) {
        notFound();
    }

    const isCreator = (session && session.user.id === questData.creator.id) ?? false;

    return (
        <>
            <Header isAuthorized={Boolean(session)}/>
            <Body>
                <Quest props={questData} isCreator={isCreator}/>
            </Body>
            <Footer />
        </>
    );
}
