import AuthForm from '@/components/AuthForm/AuthForm';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { FRONTEND_URL } from '@/app/api/client/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        default: 'Авторизация',
        template: `%s | Квестспейс`
    }
};

export default async function Auth() {
    const session = await getServerSession();
    if (session && session.user) {
        redirect(FRONTEND_URL);
    }

    return (
        <AuthForm />
    );
}
