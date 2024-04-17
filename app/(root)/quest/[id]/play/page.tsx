import { getServerSession } from 'next-auth';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import React from 'react';
import dynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';
import { BACKEND_URL } from '@/app/api/client/constants';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { IQuestTaskGroupsResponse } from '@/app/types/quest-interfaces';
import PlayPageContent from '@/components/Tasks/PlayPageContent/PlayPageContent';
import { isAllowedUser } from '@/lib/utils/utils';

const DynamicFooter = dynamic(() => import('@/components/Footer/Footer'), {
    ssr: false,
})

export default async function PlayQuestPage({params}: {params: {id: string}}) {
    const session = await getServerSession(authOptions);

    const questData = await fetch(`${BACKEND_URL}/quest/${params.id}/play`, {
        method :'GET',
        headers: {'Authorization': `Bearer ${session?.accessToken}`}})
        .then(res => res.json())
        .catch(err => {
            throw err;
        }) as IQuestTaskGroupsResponse;

    if (!questData || questData.error) {
        notFound();
    }

    if (!session || !session.user) {
        redirect('/auth');
    }

    if (!isAllowedUser(session.user.id)) {
        notFound();
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
