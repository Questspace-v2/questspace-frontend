import client, { HttpMethod } from "./client";

export interface IUser {
    id: string;
    username: string;
    password: string;
    newPassword?: string;
    avatarUrl?: string
}

export const clientHandler = {
    getUser: async function getUser(userId: string): Promise<IUser> {
        const jsonResponse = await client.invoke(`/user/${userId}`, HttpMethod.GET);
        const response: IUser = {
            id: jsonResponse.id as string,
            username: jsonResponse.username as string,
            password: '',
            avatarUrl: jsonResponse.avatar_url as string
        };

        return response;
    },

    createUser: async function createUser({ username, password }: IUser): Promise<IUser> {
        const request: IUser = {
            id: '',
            username,
            password
        };

        const jsonResponse = await client.invoke(
            '/user',
            HttpMethod.POST,
            request
        );

        const response: IUser = {
            id: jsonResponse.id as string,
            username: jsonResponse.username as string,
            password: '',
            avatarUrl: jsonResponse.avatar_url as string
        };

        return response;
    },

    updateUser: async function updateUser(userId: string, avatarUrl = '',
        newPassword = '', { username, password }: IUser): Promise<IUser> {
        const request: IUser = {
            id: userId,
            username,
            password,
            newPassword,
            avatarUrl
        };

        const jsonResponse = await client.invoke(
            `/user/${userId}`,
            HttpMethod.POST,
            request
        );

        const response: IUser = {
            id: jsonResponse.id as string,
            username: jsonResponse.username as string,
            password: '',
            avatarUrl: jsonResponse.avatar_url as string
        };

        return response;
    },
}