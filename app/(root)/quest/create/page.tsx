import { ConfigProvider } from 'antd';
import theme from '@/lib/theme/themeConfig';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import Footer from '@/components/Footer/Footer';
import CreateQuest from '@/components/CreateQuest/CreateQuest';

function CreateQuestPage() {
    return (
        <ConfigProvider theme={theme}>
            <div className={'App'}>
                <Header />
                <Body>
                    <CreateQuest />
                </Body>
                <Footer />
            </div>
        </ConfigProvider>
    );
}

export default CreateQuestPage;
