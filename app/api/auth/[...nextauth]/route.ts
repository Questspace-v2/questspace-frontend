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
    ],
    pages: {
        signIn: '/auth',
    },
    callbacks: {
        // eslint-disable-next-line @typescript-eslint/require-await
        async session({ session, token }) {
            // eslint-disable-next-line no-param-reassign
            session.user = token;
            console.log(session, token);
            return session;
        }
    },
    secret: "big-secret",
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
