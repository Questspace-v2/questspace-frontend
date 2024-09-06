/* eslint-disable no-param-reassign */
import { Account, NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { ISignInResponse } from '@/app/types/user-interfaces';
import { JWT } from 'next-auth/jwt';
import AuthService from '@/app/api/services/auth.service';
import {GoogleDataDto, LoginDataDto, RegisterDataDto} from '@/app/api/dto/auth-dto/auth';

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
                const {username, password} = credentials as LoginDataDto;
                const authService = new AuthService();

                if (!username || !password) {
                    return null;
                }

                const user = await authService
                    .login({username, password})
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
                const {username, password} = credentials as RegisterDataDto;
                const authService = new AuthService();

                if (!username || !password) {
                    return null;
                }
                const user = await authService
                    .register({username, password})
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
                accessToken?: string,
            },
            trigger?: unknown
        }) {
            if (account?.provider === 'google') {
                token.isOAuthProvider = true;
                const googleToken = account.id_token;
                const authService = new AuthService();
                if (googleToken) {
                    const data: GoogleDataDto = {
                        id_token: googleToken,
                    };
                    const backendResponse = await authService.authWithGoogle(data);
                    if (backendResponse) {
                        token.accessToken = backendResponse.access_token;
                        token.id = backendResponse.user.id;
                        token.name = backendResponse.user.username;
                        token.picture = backendResponse.user.avatar_url;
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
                isOAuthProvider: token.isOAuthProvider,
                user: {...session.user, id: token.id}
            }
        }
    },
    debug: process.env.NODE_ENV !== 'production',
    useSecureCookies: true,
};

export default authOptions;
