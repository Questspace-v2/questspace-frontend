import { getServerSession } from 'next-auth';
import React from 'react';
import { notFound, redirect } from 'next/navigation';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import PlayPageContent from '@/components/Tasks/PlayPageContent/PlayPageContent';
import PlayModeService from '@/app/api/services/play-mode.service';


export default async function PlayQuestPage({params}: {params: {id: string}}) {
    const session = await getServerSession(authOptions);
    const playModeService = new PlayModeService();

    const questData = await playModeService
        .getTaskGroupsPlayMode(params.id, session?.accessToken);

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
