'use client';

import React from 'react';
import { Button, ConfigProvider } from 'antd';
import theme from '@/theme/themeConfig';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import Header from '@/components/Header/Header';
import Body from '@/components/Body/Body';
import Footer from '@/components/Footer/Footer';

function HomePage() {
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
