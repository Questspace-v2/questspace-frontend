'use client';

import React from 'react';
import { Button, ConfigProvider } from 'antd';
import theme from '@/theme/themeConfig';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import Footer from '@/components/Footer/Footer';
import { useAppSelector } from '../redux/hooks';

function HomePage() {
    const username = useAppSelector((state) => state.userSlice.username);

    return ( // div с username - стафф, потом уберу
        <ConfigProvider theme={theme}>
            <div className={'App'}>
                <Header />
                <Body>
                    <ContentWrapper>
                        <Button type={'primary'}>Button</Button>
                        <div>{username}</div>
                    </ContentWrapper>
                </Body>
                <Footer />
            </div>
        </ConfigProvider>
    );
}

export default HomePage;
