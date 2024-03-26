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

export interface ISignInResponse {
    user: IUser,
    access_token: string
}

export interface IUserCreate extends ISignIn {
    avatar_url?: string
}

export interface ITeam {
    captain: IUser,
    id: string,
    invite_link: string,
    members: IUser[],
    name: string,
    score: 0
}
