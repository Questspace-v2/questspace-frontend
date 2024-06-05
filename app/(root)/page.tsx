import { Spin } from 'antd';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
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


async function HomePage() {
    const fetchedData = await getBackendQuests('all');
    const fetchedAllQuests = fetchedData?.quests;
    const nextPageId = fetchedData?.next_page_id;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect('/auth');
    }

    return (
        <>
            <DynamicProfile />
            <DynamicQuestTabs fetchedAllQuests={fetchedAllQuests ?? []} nextPageId={nextPageId ?? ''}/>
        </>
    );
}

export default HomePage;
