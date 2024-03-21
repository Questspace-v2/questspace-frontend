import { getServerSession } from 'next-auth';

async function getCurrentUser() {
    const session = await getServerSession();

    return session?.user;
}

export default getCurrentUser;
