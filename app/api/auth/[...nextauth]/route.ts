import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authSignIn, authSignUp } from '@/app/api/api';
import { ISignIn } from '@/app/types/user-interfaces';

const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
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
                if (user) {
                    return user;
                }
                return null;
            },
        }),
        CredentialsProvider({
            id: 'sign-up',
            type: 'credentials',
            credentials: {},
            async authorize(credentials) {
                const {username, password} = credentials as ISignIn;
                if (!username || !password) {
                    return null;
                }
                const user = await authSignUp({username, password});
                if (user) {
                    return user;
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: '/auth'
    },
    callbacks: {
        jwt({token}) {
            return token;
        },
        signIn({user}) {
            return !!user;
        },
        session({ session }) {
            // eslint-disable-next-line no-param-reassign
            session.user.isLoggedIn = true;
            return session;
        }
    },
    secret: "big-secret",
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
