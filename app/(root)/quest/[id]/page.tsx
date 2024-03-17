import { ConfigProvider } from 'antd';
import theme from '@/lib/theme/themeConfig';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import Footer from '@/components/Footer/Footer';
import Quest from '@/components/Quest/Quest';
import { BACKEND_URL } from '@/app/api/api';
import { IQuest } from '@/app/types/quest-interfaces';

async function getQuest(id: string) {
    const response = await fetch(`${BACKEND_URL}/quest/${id}`, { cache: 'no-store'});
    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    return await response.json() as IQuest;
}

export default async function QuestPage({params}: {params: {id: string}}) {
    const questData  = await getQuest(params.id);

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
