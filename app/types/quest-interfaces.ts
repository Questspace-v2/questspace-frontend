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
    status: string,
    has_brief?: boolean,
    brief?: string,
}

export interface ITask {
    correct_answers: string[],
    hints: IHint[] | string[],
    id?: string,
    media_link?: string,
    media_links?: string[],
    name: string,
    order_idx?: number,
    pub_time: string,
    question: string,
    reward: number,
    score?: number,
    verification: string,
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
    pub_time: string,
    tasks: ITask[]
}

export interface ITaskGroupsCreateRequest {
    task_groups: ITaskGroup[]
}

export interface ITaskGroupsDelete {
    id: string
}

export interface ITaskGroupsUpdate {
    id: string,
    name: string,
    order_idx: number,
    pub_time: string,
    tasks: ITasksUpdateRequest
}

export interface ITasksUpdateRequest {
    create?: ITaskCreate[],
    delete?: ITaskDelete[],
    update?: ITaskUpdate[]
}

export interface ITaskUpdate extends ITask {
    group_id: string,
    order_idx: number,
}

export interface ITaskCreate extends ITask {
    group_id: string,
    order_idx: number,
}

export interface ITaskDelete {
    id: string
}

export interface IBulkEditTaskGroups {
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

export interface IQuestTaskGroups {
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
    team?: ITeam,
    all_teams?: ITeam[],
    leaderboard?: IFinalLeaderboard
}

export interface IFinalLeaderboard {
    rows: IFinalLeaderboardRow[]
}

export interface IFinalLeaderboardRow {
    score: number,
    team_id: string,
    team_name: string,
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

export interface IEditPenaltyRequest {
    penalty: number,
    team_id: string,
}

export interface IAdminLeaderboardResponse {
    results: IAdminLeaderboardResult[],
    task_groups?: IAdminTaskGroup[] & {order_idx: number}
}

export type IAdminLeaderboardResult = {
    team_id: string,
    team_name: string,
    penalty: number,
    total_score: 0
} & Record<string, string | number>

export interface IAdminTaskGroup {
    id: string,
    name: string,
    tasks: IAdminTask[]
}

export interface IAdminTask {
    id: string,
    name: string,
    score: number
}

export interface IGetAllTeamsResponse {
    teams: ITeam[]
}

export interface IGetTaskGroupsPlayMode {
    quest: IQuest;
    task_groups: ITaskGroupPlayMode[];
    team: ITeam;
}

export interface ITaskGroupPlayMode {
    id?: string,
    name: string,
    order_idx?: number,
    pub_time?: string,
    tasks: ITaskPlayMode[]
}

export interface ITaskPlayMode {
    accepted: boolean;
    answer: string;
    hints: IHint[];
    id: string;
    media_link: string;
    name: string;
    order_idx: number;
    pub_time: string;
    question: string;
    reward: number;
    score: number;
    verification: string;
    verification_type: string;
}
