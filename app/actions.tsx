'use server'

import { redirect } from 'next/navigation'

// eslint-disable-next-line @typescript-eslint/require-await
export default async function navigate(to = '/') {
    redirect(`https://localhost:3000${to}`)
}
