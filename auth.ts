import Credentials from 'next-auth/providers/credentials';
import { IUser } from '@/app/types/user-interfaces';

const config = {
    providers: [
        Credentials({
            name: 'Username and password',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "логин" },
                password: { label: "Password", type: "пароль" }
            },
            async authorize(credentials) {
                const res = await fetch("/your/endpoint", {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                })
                const user = await res.json() as IUser;

                if (res.ok && user) {
                    return user
                }

                return null
            }
        })
    ]
};

export default config;