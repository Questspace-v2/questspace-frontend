import React from 'react';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { notFound } from 'next/navigation';
import { IGetQuestResponse } from '@/app/types/quest-interfaces';
import { getQuestById } from '@/app/api/api';
import dynamic from 'next/dynamic';
import QuestPageContent from '@/components/Quest/QuestPageContent/QuestPageContent';

const DynamicFooter = dynamic(() => import('@/components/Footer/Footer'), {
    ssr: false,
})

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

    const redirectParams = new URLSearchParams({route: 'quest', id: questData.quest.id});

    const isCreator = (session && session.user.id === questData.quest.creator.id) ?? false;

    return (
        <>
            <Header isAuthorized={Boolean(session)} redirectParams={redirectParams.toString()}/>
            <Body>
                <QuestPageContent props={questData} isCreator={isCreator}/>
            </Body>
            <DynamicFooter />
        </>
    );
}
