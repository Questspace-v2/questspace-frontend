'use server'

import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { SelectTab } from '@/components/QuestTabs/QuestTabs.helpers';
import QuestService from '@/app/api/services/quest.service';
import {PaginationDto} from '@/app/api/dto/quest-dto/pagination.dto';

export default async function getBackendQuests(tab: SelectTab, pageId?: string, pageSize = '12') {
    const session = await getServerSession(authOptions);
    const accessToken = session?.accessToken;
    const questService = new QuestService();
    const params: PaginationDto = {
        fields: [`${tab}`],
        page_size: pageSize,
    };

    if (pageId) {
        params.page_id = pageId;
    }

    const data = await questService
        .getAllQuests(params, accessToken)
        .catch(err => {
            throw err;
        });

    if (!data) {
        return null;
    }


    return data[tab];
}
