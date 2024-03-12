import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authSignIn } from '@/app/api/api';
import { ISignIn } from '@/app/types/user-interfaces';

const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {},
            async authorize(credentials) {
                try {
                    const {username, password} = credentials as ISignIn;
                    if (!username || !password) {
                        return null;
                    }
                    return await authSignIn({username, password});
                } catch (error) {
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: '/auth'
    },
    callbacks: {},
    secret: "big-secret",
}

export default NextAuth(authOptions);
