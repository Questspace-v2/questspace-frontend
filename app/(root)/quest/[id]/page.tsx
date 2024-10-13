import React from 'react';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { notFound } from 'next/navigation';
import { IGetQuestResponse } from '@/app/types/quest-interfaces';
import { getQuestById } from '@/app/api/api';
import QuestMainPage from '@/components/Quest/Quest';


// eslint-disable-next-line consistent-return
export async function generateMetadata({params}: {params: {id: string}}) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const response = await getQuestById(params.id);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (response?.length <= 0) {
            notFound();
        }

        const data = (response as IGetQuestResponse).quest;

        return {
            title: data.name,
            openGraph: {
                title: data.name,
                description: data.description,
                images: [data.media_link]
            }
        }
    } catch (error) {
        notFound();
    }
}

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
        <QuestMainPage props={questData} isCreator={isCreator}/>
    );
}
