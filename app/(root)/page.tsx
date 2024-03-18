import { ConfigProvider, Spin } from 'antd';
import theme from '@/lib/theme/themeConfig';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import dynamic from 'next/dynamic';
import Body from '@/components/Body/Body';
import getCurrentUser from '@/lib/session';

const DynamicQuestTabs = dynamic(() => import('../../components/QuestTabs/QuestTabs'), {
    ssr: false,
})

const DynamicProfile = dynamic(() => import('../../components/Profile/Profile'), {
    ssr: false,
    loading: () => <Spin size={'large'} />
})

async function HomePage() {
    const currentUser = await getCurrentUser();
    return (
        <ConfigProvider theme={theme}>
            <div className={'App'}>
                <Header />
                    <Body>
                        <DynamicProfile user={currentUser}/>
                        <DynamicQuestTabs />
                    </Body>
                <Footer />
            </div>
        </ConfigProvider>
    );
}

export default HomePage;
