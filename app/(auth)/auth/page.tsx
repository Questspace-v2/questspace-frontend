import { ConfigProvider } from 'antd';
import theme from '@/theme/themeConfig';
import LoginForm from '@/components/LoginForm/LoginForm';
import Background from '@/components/Background/Background';

export default function Auth() {
    return (
        <ConfigProvider theme={theme}>
            <div className={'App'}>
                <Background type={'page'} />
                <LoginForm />
            </div>
        </ConfigProvider>
    );
}
