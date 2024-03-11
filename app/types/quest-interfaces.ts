import { IUser } from '@/app/types/user-interfaces';

export interface IQuest {
    access: string,
    creator: IUser,
    description: string,
    finish_time: string,
    id: string,
    max_team_cap: number,
    media_link: string,
    name: string,
    registration_deadline: string,
    start_time: string
}

export type IQuestCreate = {
    creator_name: string
} & Omit<IQuest, 'creator'>