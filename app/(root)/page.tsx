import React from 'react';
import { ConfigProvider } from 'antd';
import theme from '@/lib/theme/themeConfig';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import Footer from '@/components/Footer/Footer';
import Profile from '@/components/Profile/Profile';
import QuestTabs from '@/components/QuestTabs/QuestTabs';
import dynamic from 'next/dynamic';

const DynamicBody = dynamic(() => import('../../components/Body/Body'), {
    ssr: false,
})
function HomePage() {
    return (
        <ConfigProvider theme={theme}>
            <div className={'App'}>
                <Header />
                <DynamicBody>
                    <Profile />
                    <QuestTabs />
                </DynamicBody>
                <Footer />
            </div>
        </ConfigProvider>
    );
}

export default HomePage;
