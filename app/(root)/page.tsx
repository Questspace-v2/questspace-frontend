import { Spin } from 'antd';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import Body from '@/components/Body/Body';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { getServerSession } from 'next-auth';

const DynamicQuestTabs = dynamic(() => import('../../components/QuestTabs/QuestTabs'), {
    ssr: false,
})

const DynamicProfile = dynamic(() => import('../../components/Profile/Profile'), {
    ssr: false,
    loading: () => <Spin size={'large'} />
})

async function HomePage() {
    const session = await getServerSession();

    if (!session || !session.user) {
        redirect('/auth');
    }

    return (
        <>
            <Header isAuthorized/>
            <Body>
                <DynamicProfile />
                <DynamicQuestTabs />
            </Body>
            <Footer />
        </>
    );
}

export default HomePage;
