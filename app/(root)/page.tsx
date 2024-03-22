import { Spin } from 'antd';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import Body from '@/components/Body/Body';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { getCurrentIUser } from '@/lib/session';

const DynamicQuestTabs = dynamic(() => import('../../components/QuestTabs/QuestTabs'), {
    ssr: false,
})

const DynamicProfile = dynamic(() => import('../../components/Profile/Profile'), {
    ssr: false,
    loading: () => <Spin size={'large'} />
})

async function HomePage() {
    const currentIUser = await getCurrentIUser();

    if (!currentIUser) {
        redirect('/auth');
    }

    return (
        <>
            <Header user={currentIUser}/>
            <Body>
                <DynamicProfile user={currentIUser}/>
                <DynamicQuestTabs />
            </Body>
            <Footer />
        </>
    );
}

export default HomePage;
