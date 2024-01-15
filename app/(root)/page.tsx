'use client';

import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import theme from '@/lib/theme/themeConfig';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import Footer from '@/components/Footer/Footer';
import { useAppDispatch, useAppSelector } from '../redux/hooks/hooks';
import { getUser } from '../redux/api-actions';
import Profile from '@/components/Profile/Profile';
import QuestTabs from '@/components/QuestTabs/QuestTabs';

function HomePage() {
    const dispatch = useAppDispatch();
    const testId = '855db36b-b217-4db5-baf0-3370fda3e74e';

    useEffect(() => {
        dispatch(getUser(testId));
    }, [dispatch]);

    // Проверка работы глобального хранилища - добавить после кнопки <div>{username}</div>
    // const username = useAppSelector((state) => state.userSlice.username);

    return (
        <ConfigProvider theme={theme}>
            <div className={'App'}>
                <Header />
                <Body>
                    <Profile />
                    <QuestTabs />
                </Body>
                <Footer />
            </div>
        </ConfigProvider>
    );
}

export default HomePage;