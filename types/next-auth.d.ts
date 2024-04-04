import { DefaultSession } from 'next-auth';
import { IUser } from '@/app/types/user-interfaces';

declare module "next-auth" {
    interface Session {
        accessToken: string,
        isOAuthProvider: boolean,
        user: {
            id: string,
        } & DefaultSession["user"]
    }

    interface User {
        user: IUser,
        access_token: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string,
        isOAuthProvider: boolean
    }
}