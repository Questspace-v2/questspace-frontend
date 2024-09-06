import React from 'react';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { notFound } from 'next/navigation';
import QuestPageContent from '@/components/Quest/QuestPageContent/QuestPageContent';
import QuestService from "@/app/api/services/quest.service";

// eslint-disable-next-line consistent-return
export async function generateMetadata({params}: {params: {id: string}}) {
    const questService = new QuestService();
    try {
        const response = await questService.getQuestById(params.id);
        const data = response.quest;

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

    if (!session) {
        return null;
    }

    const questService = new QuestService();
    const questData = await questService
        .getQuestById(params.id, session.accessToken)
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
