import Quest from '@/components/Quest/Quest';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import Footer from '@/components/Footer/Footer';
import React from 'react';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { notFound } from 'next/navigation';
import { IQuest } from '@/app/types/quest-interfaces';
import { getQuestById } from '@/app/api/api';

export default async function QuestPage({params}: {params: {id: string}}) {
    const session = await getServerSession(authOptions);
    const questData = await getQuestById(params.id, session?.accessToken)
        .then(res => res as IQuest)
        .catch(err => {
            throw err;
        })

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
