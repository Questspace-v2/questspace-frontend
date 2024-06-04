import React from 'react';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { notFound } from 'next/navigation';
import { IGetQuestResponse } from '@/app/types/quest-interfaces';
import { getQuestById } from '@/app/api/api';
import QuestPageContent from '@/components/Quest/QuestPageContent/QuestPageContent';

export default async function QuestPage({params}: {params: {id: string}}) {
    const session = await getServerSession(authOptions);
    const questData = await getQuestById(params.id, session?.accessToken)
        .then(res => res as IGetQuestResponse)
        .catch(err => {
            throw err;
        })

    if (!questData) {
        notFound();
    }

    const isCreator = (session && session.user.id === questData.quest.creator.id) ?? false;

    return (
        <QuestPageContent props={questData} isCreator={isCreator}/>
    );
}
