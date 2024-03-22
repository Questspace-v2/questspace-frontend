import { getServerSession } from 'next-auth';
import { IUser } from '@/app/types/user-interfaces';

export async function getCurrentUser() {
    const session = await getServerSession();

    return session?.user;
}

export async function getCurrentIUser() {
    const sessionUser = await getCurrentUser();

    if (!sessionUser) {
        return undefined;
    }

    const {name, image, id} = sessionUser;
    const user : IUser = {
        username: name!,
        avatar_url: image!,
        id
    }

    return user;
}
