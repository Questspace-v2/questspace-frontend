import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

async function getCurrentUser() {
    const session = await getServerSession(authOptions);

    return session?.user;
}

export default getCurrentUser;
