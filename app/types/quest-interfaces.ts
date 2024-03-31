import { IUser } from '@/app/types/user-interfaces';

export interface IQuest {
    creator: IUser,
    description: string,
    finish_time: string | Date,
    id: string,
    max_team_cap: number,
    media_link: string,
    name: string,
    registration_deadline: string | Date,
    start_time: string | Date,
    status: string
}

export type IQuestCreate = Omit<IQuest, 'creator' | 'status' | 'id'>

export interface ITaskGroupsCreate {
    name: string,
    order_idx: number,
    pub_time: string
}

export interface ITaskGroupsDelete {
    id: string
}

export interface ITaskGroupsUpdate extends ITaskGroupsCreate {
    id: string
}

export interface IQuestTaskGroups {
    create?: ITaskGroupsCreate[],
    delete?: ITaskGroupsDelete[],
    update?: ITaskGroupsUpdate[]
}

export interface IQuestTaskGroupsResponse extends ITaskGroupsUpdate {
    quest: IQuest
}

export interface IFilteredQuests {
    next_page_id: string,
    quests: IQuest[]
}

export interface IFilteredQuestsResponse {
    all?: IFilteredQuests,
    owned?: IFilteredQuests,
    registered?: IFilteredQuests
}
