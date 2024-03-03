import { ConfigProvider } from 'antd';
import theme from '@/lib/theme/themeConfig';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import dynamic from 'next/dynamic';
import Body from '@/components/Body/Body';
import Loading from '@/app/(root)/loading';

const DynamicQuestTabs = dynamic(() => import('../../components/QuestTabs/QuestTabs'), {
    ssr: false,
})

const DynamicProfile = dynamic(() => import('../../components/Profile/Profile'), {
    ssr: false,
    loading: () => <Loading />
})

function HomePage() {
    return (
        <ConfigProvider theme={theme}>
            <div className={'App'}>
                <Header />
                    <Body>
                        <DynamicProfile />
                        <DynamicQuestTabs />
                    </Body>
                <Footer />
            </div>
        </ConfigProvider>
    );
}

export default HomePage;
