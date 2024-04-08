import { Spin } from 'antd';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import Body from '@/components/Body/Body';
import Header from '@/components/Header/Header';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import getBackendQuests from '@/components/QuestTabs/QuestTabs.server';

const DynamicQuestTabs = dynamic(() => import('@/components/QuestTabs/QuestTabs'), {
    ssr: false,
})

const DynamicProfile = dynamic(() => import('@/components/Profile/Profile'), {
    ssr: false,
    loading: () => <Spin size={'large'} />
})

const DynamicFooter = dynamic(() => import('@/components/Footer/Footer'), {
    ssr: false,
})

async function HomePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect('/auth');
    }

    const fetchedAllQuests = await getBackendQuests('all');

    return (
        <>
            <Header isAuthorized/>
            <Body>
                <DynamicProfile />
                <DynamicQuestTabs fetchedAllQuests={fetchedAllQuests}/>
            </Body>
            <DynamicFooter />
        </>
    );
}

export default HomePage;
