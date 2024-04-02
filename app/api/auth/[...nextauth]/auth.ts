/* eslint-disable no-param-reassign */
import { Account, NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { ISignIn, ISignInResponse, IUserCreate } from '@/app/types/user-interfaces';
import { authRegister, authSignIn, authWithGoogle } from '@/app/api/api';
import { JWT } from 'next-auth/jwt';

const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            id: 'google',
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            id: 'sign-in',
            type: 'credentials',
            credentials: {
                username: {type: 'text'},
                password: {type: 'password'}
            },
            // @ts-expect-error все нормально, все под контролем
            async authorize(credentials) {
                const {username, password} = credentials as ISignIn;
                if (!username || !password) {
                    return null;
                }

                const user = await authSignIn({username, password})
                    .then(response => response as ISignInResponse)
                    .catch(() => null);
                if (!user) {
                    return null;
                }

                return user;
            },
        }),
        CredentialsProvider({
            id: 'sign-up',
            type: 'credentials',
            credentials: {
                username: {type: 'text'},
                password: {type: 'password'}
            },
            // @ts-expect-error все нормально, все под контролем
            async authorize(credentials) {
                const {username, password} = credentials as IUserCreate;
                if (!username || !password) {
                    return null;
                }
                const user = await authRegister({username, password})
                    .then(response => response as ISignInResponse)
                    .catch(() => null);

                if (!user) {
                    return null;
                }
                return user;
            }
        })
    ],
    pages: {
        signIn: '/auth',
        signOut: '/auth',
    },
    callbacks: {
        async jwt({token, user, account, session, trigger} : {
            token: JWT,
            user: ISignInResponse,
            account: Account | null,
            session?: {
                name?: string,
                image?: string,
                accessToken?: string
            },
            trigger?: unknown
        }) {
            if (account?.provider === 'google') {
                const googleToken = account.access_token;
                if (googleToken) {
                    const backendResponse = await authWithGoogle(googleToken) as ISignInResponse;
                    if (backendResponse) {
                        user.access_token = backendResponse.access_token;
                        token.accessToken = user.access_token;
                    }
                }
                return token;
            }
            if (user) {
                token.accessToken = user.access_token;
                token.id = user.user.id;
                token.name = user.user.username;
                token.picture = user.user.avatar_url;
            }
            if (trigger === 'update' && session) {
                if (session.name) {
                    token.name = session.name;
                }
                if (session.image) {
                    token.picture = session.image;
                }
                if (session.accessToken) {
                    token.accessToken = session.accessToken;
                }
            }
            return token
        },
        session({ session, token }) {
            return {
                expires: session.expires,
                accessToken: token.accessToken,
                user: {...session.user, id: token.id}
            }
        }
    },
    debug: process.env.NODE_ENV !== 'production',
    useSecureCookies: true,
};

export default authOptions;
