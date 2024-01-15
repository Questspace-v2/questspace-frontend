export interface IUserState {
    username: string,
    avatarUrl: string,
    error: string | null,
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

export type IUserCreate = {
    password: string,
} & Omit<IUserState, 'error'>
