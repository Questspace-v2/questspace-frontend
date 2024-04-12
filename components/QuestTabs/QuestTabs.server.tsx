'use server'

import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { getFilteredQuests } from '@/app/api/api';
import { IFilteredQuestsResponse } from '@/app/types/quest-interfaces';
import { SelectTab } from '@/components/QuestTabs/QuestTabs.helpers';

export default async function getBackendQuests(tab: SelectTab, pageId?: string, pageSize = '8') {
    const session = await getServerSession(authOptions);
    const accessToken = session?.accessToken;
    const data = await getFilteredQuests(
        [`${tab}`],
        accessToken,
        pageId,
        pageSize
    )
        .then(res => res as IFilteredQuestsResponse)
        .catch(err => {
            throw err;
        });

    if (!data) {
        return null;
    }


    return data[tab];
}
