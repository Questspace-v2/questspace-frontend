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

export interface ITaskGroupsCreate {
    name: string,
    order_idx: number,
    pub_time: string
}

export interface ITaskGroupsDelete {
    id: string
}

export type ITaskGroupsUpdate = ITaskGroupsCreate & ITaskGroupsDelete

export interface IQuestTaskGroups {
    create?: ITaskGroupsCreate[],
    delete?: ITaskGroupsDelete[],
    update?: ITaskGroupsUpdate[]
}

export type IQuestTaskGroupsResponse = {
    quest: IQuest
} & ITaskGroupsUpdate
