import { getServerSession } from 'next-auth';
import React from 'react';
import { notFound, redirect } from 'next/navigation';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { IQuestTaskGroupsResponse } from '@/app/types/quest-interfaces';
import PlayPageContent from '@/components/Tasks/PlayPageContent/PlayPageContent';
import { getTaskGroupsPlayMode } from '@/app/api/api';
import ContextProvider from '@/components/Tasks/ContextProvider/ContextProvider';


export default async function PlayQuestPage({params}: {params: {id: string}}) {
    const session = await getServerSession(authOptions);

    const questData = await getTaskGroupsPlayMode(params.id, session?.accessToken) as IQuestTaskGroupsResponse;
    const hasNoBrief = questData?.quest?.status === 'REGISTRATION_DONE' && (!questData?.quest?.has_brief || !questData?.quest?.brief);

    if (!questData || hasNoBrief || questData.error) {
        notFound();
    }

    if (!session || !session.user) {
        redirect('/auth');
    }

    return (
        <ContextProvider questData={questData}>
            <PlayPageContent props={questData}/>
        </ContextProvider>
    );
}
