'use server'

import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { getFilteredQuests } from '@/app/api/api';
import { IFilteredQuestsResponse } from '@/app/types/quest-interfaces';
import { customizedEmpty, SelectTab, wrapInCard } from '@/components/QuestTabs/QuestTabs.helpers';

export default async function getBackendQuests(tab: SelectTab) {
    const session = await getServerSession(authOptions);
    const accessToken = session?.accessToken;
    const data = await getFilteredQuests(
        [`${tab}`],
        accessToken
    )
        .then(res => res as IFilteredQuestsResponse)
        .catch(err => {
            throw err;
        });

    if (!data) {
        return customizedEmpty;
    }

    const quests = data[tab]?.quests;

    if (!quests) {
        return customizedEmpty;
    }

    return quests.map(quest => wrapInCard(quest));
}
