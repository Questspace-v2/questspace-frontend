'use client'

import { IQuest } from '@/app/types/quest-interfaces';
import { customizedEmpty, wrapInCard } from '@/components/QuestTabs/QuestTabs.helpers';
import { isAllowedUser } from '@/lib/utils/utils';
import { useSession } from 'next-auth/react';

export default function QuestCardsList({quests}: {quests?: IQuest[]}) {
    const {data} = useSession();
    if (!quests || quests.length === 0) {
        return customizedEmpty(isAllowedUser(data ? data.user.id : ''));
    }
    return (
        <>
            {quests.map((quest) => wrapInCard(quest))}
        </>
    );
}
