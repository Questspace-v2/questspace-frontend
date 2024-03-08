import { IUser } from '@/app/types/user-interfaces';

export interface IQuest {
    access: string,
    creator: IUser,
    description: string,
    finishTime: string,
    id: string,
    maxTeamCap: 0,
    mediaLink: string,
    name: string,
    registrationDeadline: string,
    startTime: string
}

export type IQuestCreate = {
    creatorName: string
} & Omit<IQuest, 'creator'>