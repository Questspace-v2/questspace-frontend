import { getServerSession } from 'next-auth';
import React from 'react';
import { notFound, redirect } from 'next/navigation';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { IQuestTaskGroupsResponse } from '@/app/types/quest-interfaces';
import PlayPageContent from '@/components/Tasks/PlayPageContent/PlayPageContent';
import { getTaskGroupsPlayMode } from '@/app/api/api';


export default async function PlayQuestPage({params}: {params: {id: string}}) {
    const session = await getServerSession(authOptions);

    const questData = await getTaskGroupsPlayMode(params.id, session?.accessToken) as IQuestTaskGroupsResponse;

    if (!questData || questData.error) {
        notFound();
    }

    if (!session || !session.user) {
        redirect('/auth');
    }

    return (
        <PlayPageContent props={questData}/>
    );
}
