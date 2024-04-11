'use client'

import { IQuest } from '@/app/types/quest-interfaces';
import { customizedEmpty, wrapInCard } from '@/components/QuestTabs/QuestTabs.helpers';

export default function QuestCardsList({quests}: {quests: IQuest[]}) {
    if (quests.length === 0) {
        return customizedEmpty;
    }
    return (
        <>
            {quests.map((quest) => wrapInCard(quest))}
        </>
    );
}