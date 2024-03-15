import { ConfigProvider } from 'antd';
import theme from '@/lib/theme/themeConfig';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import Footer from '@/components/Footer/Footer';
import dynamic from 'next/dynamic';

const DynamicQuest = dynamic(() => import('@/components/Quest/Quest'))
export default function QuestPage({params}: {params: {id: string}}) {
    return (
        <ConfigProvider theme={theme}>
            <div className={'App'}>
                <Header />
                <Body>
                    <DynamicQuest id={params.id}/>
                </Body>
                <Footer />
            </div>
        </ConfigProvider>
    );
}
