import { getServerSession } from 'next-auth';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import Footer from '@/components/Footer/Footer';
import React from 'react';

export default async function EditQuestPage() {
    const session = await getServerSession();

    return (
        <>
            <Header isAuthorized={Boolean(session)}/>
            <Body>
            </Body>
            <Footer />
        </>
    );
}
