import AuthForm from '@/components/AuthForm/AuthForm';
import Background from '@/components/Background/Background';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { FRONTEND_URL } from '@/app/api/client/constants';

export default async function Auth() {
    const session = await getServerSession();
    if (session && session.user) {
        redirect(FRONTEND_URL);
    }

    return (
        <><Background type={'page'} /><AuthForm /></>
    );
}
