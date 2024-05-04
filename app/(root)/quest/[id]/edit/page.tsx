import { getServerSession } from 'next-auth';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import React from 'react';
import dynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { getTaskGroupsAdmin } from '@/app/api/api';
import { ITaskGroupsAdminResponse } from '@/app/types/quest-interfaces';
import QuestAdmin from '@/components/QuestAdmin/QuestAdmin';
import { isAllowedUser } from '@/lib/utils/utils';
import ContextProvider from '@/components/Tasks/ContextProvider/ContextProvider';

const DynamicFooter = dynamic(() => import('@/components/Footer/Footer'), {
    ssr: false,
})

export default async function EditQuestPage({params}: {params: {id: string}}) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect('/auth');
    }

    if (!isAllowedUser(session.user.id)) {
        notFound();
    }

    const questData = await getTaskGroupsAdmin(params.id, session.accessToken) as ITaskGroupsAdminResponse;

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
                <ContextProvider taskGroups={questData.task_groups}>
                    <QuestAdmin questData={questData}/>
                </ContextProvider>
            </Body>
            <DynamicFooter />
        </>
    );
}
