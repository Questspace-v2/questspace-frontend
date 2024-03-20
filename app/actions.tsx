'use server'

import { redirect } from 'next/navigation'
import { FRONTEND_URL } from '@/app/api/client/constants';

// eslint-disable-next-line @typescript-eslint/require-await
export default async function navigate(to = '/') {
    redirect(`${FRONTEND_URL}${to}`);
}
