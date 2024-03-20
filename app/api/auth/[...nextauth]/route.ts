/* eslint-disable no-param-reassign */
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authSignIn, authSignUp } from '@/app/api/api';
import { ISignIn, IUserCreate } from '@/app/types/user-interfaces';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'sign-in',
            type: 'credentials',
            credentials: {},
            async authorize(credentials) {
                const {username, password} = credentials as ISignIn;
                if (!username || !password) {
                    return null;
                }
                const user = await authSignIn({username, password});
                if (!user) {
                    return null;
                }
                return user;
            },
        }),
        CredentialsProvider({
            id: 'sign-up',
            type: 'credentials',
            credentials: {},
            async authorize(credentials) {
                const {username, password} = credentials as IUserCreate;
                if (!username || !password) {
                    return null;
                }
                const user = await authSignUp({username, password});
                if (!user) {
                    return null;
                }
                return user;
            }
        })
    ],
    pages: {
        signIn: '/auth',
        signOut: '/auth'
    },
    callbacks: {
        jwt({token, user}) { // Тут бы делать запрос, существует ли юзер
            if (user) {
                token.id = user?.id;
            }
            return token
        },
        session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.image = token.picture;
            }

            return session
        }
    },
    secret: "big-secret",
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
