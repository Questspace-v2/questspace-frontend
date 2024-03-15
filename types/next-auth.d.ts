import { DefaultSession } from 'next-auth';

declare module "next-auth" {
    interface Session {
        user: {
            isLoggedIn: boolean
        } & DefaultSession["user"]
    }
}