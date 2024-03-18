import { ConfigProvider } from 'antd';
import theme from '@/lib/theme/themeConfig';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import Footer from '@/components/Footer/Footer';
import Quest from '@/components/Quest/Quest';
import { getQuestById } from '@/app/api/api';

export default async function QuestPage({params}: {params: {id: string}}) {
    const questData  = await getQuestById(params.id);

    return (
        <ConfigProvider theme={theme}>
            <div className={'App'}>
                <Header />
                <Body>
                    <Quest props={questData}/>
                </Body>
                <Footer />
            </div>
        </ConfigProvider>
    );
}
