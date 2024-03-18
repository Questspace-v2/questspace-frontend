export interface IUser {
    avatar_url: string,
    id: string,
    username: string,
}

export interface IUserUpdate {
    avatar_url?: string,
    username?: string
}

export interface IPasswordUpdate {
    old_password: string,
    new_password: string
}

export interface ISignIn {
    username: string,
    password: string
}

export type IUserCreate = {
    avatar_url?: string
} & ISignIn
