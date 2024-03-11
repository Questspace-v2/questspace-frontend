export interface IUserState {
    username: string,
    avatar_url: string,
    error: string | null,
}

export interface IUser {
    avatar_url: string,
    id: string,
    username: string,
}

export type IUserUpdate = Omit<IUserState, 'error'>

export interface IPasswordUpdate {
    old_password: string,
    new_password: string
}

export interface ISignIn {
    username: string,
    password: string
}

export type IUserCreate = {
    password: string,
    avatar_url?: string,
} & Omit<IUserState, 'error' | 'avatar_url'>
