import { ITeam, IUser } from '@/app/types/user-interfaces';

export interface IQuest {
    access: string,
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

export interface ITask {
    correct_answers: string[],
    hints: IHint[] | string[],
    id?: string,
    media_link?: string,
    name: string,
    order_idx?: number,
    pub_time: string,
    question: string,
    reward: number,
    verification_type: string,
    answer?: string
}

export interface IHint {
    taken: boolean,
    text: string
}

export interface ITaskGroup {
    id?: string,
    name: string,
    order_idx?: number,
    pub_time?: string,
    tasks: ITask[]
}

export type IQuestCreate = Omit<IQuest, 'creator' | 'status' | 'id'>

export interface ITaskGroupsCreate {
    name: string,
    order_idx: number,
    pub_time: string
}

export interface ITaskGroupsCreateRequest {
    task_groups: ITaskGroup[]
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
    quest: IQuest,
    team: ITeam,
    task_groups: ITaskGroup[],
    error?: string
}

export interface ITaskGroupsAdminResponse {
    quest: IQuest,
    task_groups: ITaskGroup[]
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

export interface IGetQuestResponse {
    quest: IQuest,
    team?: ITeam
}

export interface ITaskAnswer {
    taskID: string,
    text: string
}

export interface ITaskAnswerResponse {
    accepted: boolean,
    score: number,
    text: string
}

export interface IHintRequest {
    index: number,
    task_id: string
}

export interface IHintResponse {
    index: number,
    text: string
}

export interface IQuestResult {
    id: string,
    name: string,
    task_groups: ITaskGroup[],
    total_score: number
}

export interface ILeaderboardResponse {
    results: IQuestResult[]
}
