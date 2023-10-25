import client, { HttpMethod } from "./client";

interface IUserAuth {
    id: string;
    username: string;
    password: string;
}

interface IUser extends IUserAuth {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
}

export const clientHandler = {
    getUser: async function getUser(userId: string): Promise<IUser> {
        return client.invoke(`/user/${userId}`, HttpMethod.GET);
    },

    createUser: async function createUser({username, password}: IUserAuth): Promise<IUserAuth> {
        const request: IUserAuth = {
            id: '',
            username,
            password
        };

        const response = await client.invoke(
            `/user`,
            HttpMethod.POST,
            request
        );

        return response as IUserAuth;
    },

    updateUser: async function updateUser(userId: string, {username, password, avatarUrl}: IUser): Promise<IUser> {
        const request: IUser = {
            id: userId,
            username,
            password,
            avatarUrl
        };

        const response = await client.invoke(
            `/user/${userId}`,
            HttpMethod.POST,
            request
        );

        return response as IUser;
    },
}