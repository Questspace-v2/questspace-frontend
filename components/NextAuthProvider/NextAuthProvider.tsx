"use client"

import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import React, { ReactNode } from 'react';

export default function NextAuthProvider({children, session}: {children: ReactNode, session: Session | null}) {
    return <SessionProvider session={session}>{children}</SessionProvider>;
}
