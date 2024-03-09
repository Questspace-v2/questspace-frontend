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

export type IUserUpdate = Omit<IUserState, 'error'>

export interface IPasswordUpdate {
    oldPassword: string,
    newPassword: string
}

export interface ISignIn {
    username: string,
    password: string
}

export type IUserCreate = {
    password: string,
    avatarUrl?: string,
} & Omit<IUserState, 'error' | 'avatarUrl'>
