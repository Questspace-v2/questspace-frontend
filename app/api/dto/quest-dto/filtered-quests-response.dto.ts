import {QuestDto} from '@/app/api/dto/quest-dto/quest.dto';

export interface FilteredQuests {
    readonly next_page_id: string,
    readonly quests: readonly QuestDto[]
}
export interface FilteredQuestsResponseDto {
    readonly all?: FilteredQuests;
    readonly owned?: FilteredQuests;
    readonly registered?: FilteredQuests;
}