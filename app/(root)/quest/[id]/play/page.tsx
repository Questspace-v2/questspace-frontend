import { getServerSession } from 'next-auth';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import React from 'react';
import dynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { IQuestTaskGroupsResponse } from '@/app/types/quest-interfaces';
import PlayPageContent from '@/components/Tasks/PlayPageContent/PlayPageContent';
import { getTaskGroupsPlayMode } from '@/app/api/api';

const DynamicFooter = dynamic(() => import('@/components/Footer/Footer'), {
    ssr: false,
})

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
        <>
            <Header isAuthorized/>
            <Body>
                <PlayPageContent props={questData}/>
            </Body>
            <DynamicFooter />
        </>
    );
}
