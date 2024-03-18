'use server'

import { redirect } from 'next/navigation'
import { FRONTEND_URL } from '@/app/api/api';

// eslint-disable-next-line @typescript-eslint/require-await
export default async function navigate(to = '/') {
    redirect(`${FRONTEND_URL}${to}`);
}
