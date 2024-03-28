/* eslint-disable no-param-reassign */
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authSignIn, authRegister } from '@/app/api/api';
import { ISignIn, ISignInResponse, IUserCreate } from '@/app/types/user-interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { JWT } from 'next-auth/jwt';


export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
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
        jwt({token, user, session, trigger} : {
            token: JWT,
            user: ISignInResponse,
            session?: {
                name?: string,
                image?: string
            },
            trigger?: unknown
        }) {
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

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const handler =  (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);

export {handler as GET, handler as POST};
