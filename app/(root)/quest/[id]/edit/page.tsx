import { getServerSession } from 'next-auth';
import React from 'react';
import { notFound, redirect } from 'next/navigation';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { getTaskGroupsAdmin } from '@/app/api/api';
import { ITaskGroupsAdminResponse } from '@/app/types/quest-interfaces';
import QuestAdmin from '@/components/QuestAdmin/QuestAdmin';
import { isAllowedUser } from '@/lib/utils/utils';
import ContextProvider from '@/components/Tasks/ContextProvider/ContextProvider';


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
        <ContextProvider taskGroups={questData.task_groups}>
            <QuestAdmin questData={questData}/>
        </ContextProvider>
    );
}
