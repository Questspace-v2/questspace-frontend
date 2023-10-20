import client, { HttpMethod } from "./client";

interface IUser {
    id: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
}

export const clientHandler = {
    getUser: async function getUser(userId: string): Promise<IUser> {
        return client.invoke(`/user/${userId}`, HttpMethod.GET);
    },

    createUser: async function createUser( // Втф что тут с параметрами и реквестом
        username: string,
        password: string,
        firstName?: string,
        lastName?: string,
        avatarUrl?: string
    ): Promise<IUser> {
        const request: IUser = Object.assign({},
            username && { username },
            password && { password },
            firstName && { first_name: firstName },
            lastName && { last_name: lastName },
            avatarUrl && { avatar_url: avatarUrl }
        );

        return client.invoke(
            `/user`,
            HttpMethod.POST,
            request
        )
    },

    updateUser: async function updateUser(
        userId: string,
        username?: string,
        password?: string,
        avatarUrl?: string
    ): Promise<IUser> {
        return client.invoke(
            `/user/${userId}`,
            HttpMethod.POST,
            {
                'username': username,
                'password': password,
                'avatar_url': avatarUrl
            }
        )
    },

    hello: async function hello() {
        return client.invoke(`/hello`, HttpMethod.GET);
    },
}