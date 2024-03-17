export interface IUserState {
    username: string,
    avatarUrl: string,
    error: string | null,
}

export interface IUser {
    avatar_url: string,
    id: string,
    username: string,
}

export interface IUserUpdate {
    username?: string,
    avatarUrl?: string
}

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
