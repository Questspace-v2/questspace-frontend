'use client';

import React, { useEffect } from 'react';
import { Button, ConfigProvider } from 'antd';
import theme from '@/theme/themeConfig';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import Footer from '@/components/Footer/Footer';
import { useAppDispatch, useAppSelector } from '../redux/hooks/hooks';
import { IUserCreate } from '../redux/types/user-interfaces';
import { createUser } from '../redux/api-actions';

function HomePage() {
    const dispatch = useAppDispatch();
    const mockUser: IUserCreate = {
        avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg',
        password: '12345',
        username: 'svayp11',
    };

    useEffect(() => {
        dispatch(createUser(mockUser));
    }, [dispatch]);

    // Проверка работы глобального хранилища
    // const username = useAppSelector((state) => state.userSlice.username);

    return (
        <ConfigProvider theme={theme}>
            <div className={'App'}>
                <Header />
                <Body>
                    <ContentWrapper>
                        <Button type={'primary'}>Button</Button>
                    </ContentWrapper>
                </Body>
                <Footer />
            </div>
        </ConfigProvider>
    );
}

export default HomePage;
