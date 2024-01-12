export interface IUserState {
    username: string,
    avatarUrl: string,
}

export interface IUser {
    avatarUrl: string,
    id: string,
    username: string,
}

export type IUserUpdate = {
    newPassword: string,
    oldPassword: string,
} & IUser


