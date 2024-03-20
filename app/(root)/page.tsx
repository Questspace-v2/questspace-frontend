import { ConfigProvider, Spin } from 'antd';
import theme from '@/lib/theme/themeConfig';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import dynamic from 'next/dynamic';
import Body from '@/components/Body/Body';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const DynamicQuestTabs = dynamic(() => import('../../components/QuestTabs/QuestTabs'), {
    ssr: false,
})

const DynamicProfile = dynamic(() => import('../../components/Profile/Profile'), {
    ssr: false,
    loading: () => <Spin size={'large'} />
})

async function HomePage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('https://new.questspace.app:3000/auth'); // Временно захардкожено
    }
    return (
        <ConfigProvider theme={theme}>
            <div className={'App'}>
                <Header />
                    <Body>
                        <DynamicProfile userName='hahaha'/>
                        <DynamicQuestTabs />
                    </Body>
                <Footer />
            </div>
        </ConfigProvider>
    );
}

export default HomePage;
