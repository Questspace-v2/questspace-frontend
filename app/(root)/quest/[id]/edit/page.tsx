import { getServerSession } from 'next-auth';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import React from 'react';
import dynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { getQuestById } from '@/app/api/api';
import { IGetQuestResponse } from '@/app/types/quest-interfaces';
import QuestAdmin from '@/components/QuestAdmin/QuestAdmin';

const DynamicFooter = dynamic(() => import('@/components/Footer/Footer'), {
    ssr: false,
})

export default async function EditQuestPage({params}: {params: {id: string}}) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/auth');
    }

    const questData = await getQuestById(params.id, session.accessToken)
        .then(res => res as IGetQuestResponse)
        .catch(err => {
            throw err;
        })

    if (!questData) {
        notFound();
    }

    const isCreator = questData.quest.creator.id === session.user.id;

    if (!isCreator) {
        notFound();
    }

    return (
        <>
            <Header isAuthorized/>
            <Body>
                <QuestAdmin questData={questData}/>
            </Body>
            <DynamicFooter />
        </>
    );
}
