import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import dynamic from 'next/dynamic';
import { Spin } from 'antd';
import { isAllowedUser } from '@/lib/utils/utils';
import authOptions from '@/app/api/auth/[...nextauth]/auth';

const DynamicCreateQuest = dynamic(() => import('@/components/Quest/EditQuest/EditQuest'), {
    ssr: false,
    loading: () => <Spin size={'large'} />
})

export default async function CreateQuestPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect('/auth');
    }

    if (!isAllowedUser(session.user.id)) {
        notFound();
    }

    return (
        <DynamicCreateQuest />
    );
}
