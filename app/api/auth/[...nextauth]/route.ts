/* eslint-disable no-param-reassign */
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authSignUp } from '@/app/api/api';
import { ISignIn, ISignInResponse, IUserCreate } from '@/app/types/user-interfaces';
import { BACKEND_URL } from '@/app/api/client/constants';
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
                const user = await fetch(`${BACKEND_URL}/auth/sign-in`,{
                    method: 'POST',
                    body: JSON.stringify({username, password})
                })
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } return null}) as ISignInResponse;
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
        // @ts-expect-error мы точно знаем, что приходит
        jwt({token, user} : {token: JWT, user: ISignInResponse}) {
            if (user) {
                token.accessToken = user.access_token;
                token.id = user.user.id;
                token.name = user.user.username;
                token.picture = user.user.avatar_url;
            }
            return token
        },
        session({ session, token }) {
            if (token) {
                session.accessToken = token.accessToken as string;
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.image = token.picture;
            }

            return session
        }
    },
    debug: process.env.NODE_ENV === 'development',
    useSecureCookies: true,
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const handler =  (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);

export {handler as GET, handler as POST};
