import { ConfigProvider } from 'antd';
import theme from '@/lib/theme/themeConfig';
import AuthForm from '@/components/AuthForm/AuthForm';
import Background from '@/components/Background/Background';

export default function Auth() {
    return (
        <ConfigProvider theme={theme}>
            <div className={'App'}>
                <Background type={'page'} />
                <AuthForm />
            </div>
        </ConfigProvider>
    );
}
