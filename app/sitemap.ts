import { FRONTEND_URL } from '@/app/api/client/constants';
import getBackendQuests from '@/components/QuestTabs/QuestTabs.server';
import { IQuest } from '@/app/types/quest-interfaces';


export default async function sitemap() {
    let nextPageId: string | undefined = '';
    const questIds: string[] = [];
    while (nextPageId !== undefined) {
        // eslint-disable-next-line no-await-in-loop
        const data = await getBackendQuests('all', nextPageId, '50');
        questIds.push(...(data?.quests ?? []).map((quest: IQuest) => quest.id) ?? []);

        nextPageId = data?.next_page_id;
    }

    const questsSitemap = questIds.map((id: string) => ({
        url:`${FRONTEND_URL}/quest/${id}`,
        lastModified: new Date(),
        priority: 0.5
    }))

    return [
        {
            url: FRONTEND_URL,
            lastModified: new Date(),
            priority: 1
        },
        {
            url: `${FRONTEND_URL}/auth`,
            lastModified: new Date(),
            priority: 0.8
        },
        ...questsSitemap
    ]
}
