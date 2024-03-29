'use client'

import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';

import './CreateQuest.css';
import { Button, Form, Tabs, TabsProps, UploadFile } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { useEffect, useRef, useState } from 'react';
import QuestPreview from '@/components/CreateQuest/QuestPreview/QuestPreview';
import QuestEditor, { QuestAboutForm } from '@/components/CreateQuest/QuestEditor/QuestEditor';
import { SelectTab } from '@/components/QuestTabs/QuestTabs.helpers';
import { useSession } from 'next-auth/react';

export default function CreateQuest() {
    const [selectedTab, setSelectedTab] = useState<string>('editor');
    const [form] = Form.useForm<QuestAboutForm>();
    const watch = Form.useWatch([], form);
    const {xs, sm, md} = useBreakpoint();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const fileListRef = useRef(fileList[0]);
    const {accessToken} = (useSession().data!);

    useEffect(() => {
        // eslint-disable-next-line prefer-destructuring
        fileListRef.current = fileList[0];
    }, [fileList]);

    const items: TabsProps['items'] = [
        {
            key: 'editor',
            label: 'Редактор',
            children: <QuestEditor form={form} fileList={fileList} setFileList={setFileList} accessToken={accessToken}/>,
        },
        {
            key: 'preview',
            label: 'Предпросмотр',
            children: <QuestPreview form={watch} file={fileListRef.current}/>,
        },
    ];

    if (sm && !md) {
        return (
            <ContentWrapper className={'create-quest__content-wrapper'}>
                <div className={'create-quest__header__content'}>
                    <Link href={'/'} style={{textDecoration: 'none', width: 'min-content'}} >
                        <Button className={'main-menu__button'} type={'link'} size={'middle'}>
                            <ArrowLeftOutlined />Вернуться на главную
                        </Button>
                    </Link>
                    <h1 className={'roboto-flex-header responsive-header-h1'}>Создание квеста</h1>
                </div>
                <Tabs items={items} activeKey={selectedTab} onTabClick={setSelectedTab}/>
            </ContentWrapper>
        );
    }

    /* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */
    if (xs) {
        return (
            <ContentWrapper className={'create-quest__content-wrapper'}>
                <div className={'create-quest__header__content'}>
                    <Link href={'/'} style={{textDecoration: 'none', width: 'min-content'}} >
                        <Button className={'main-menu__button'} type={'link'} size={'middle'}>
                            <ArrowLeftOutlined />Вернуться на главную
                        </Button>
                    </Link>
                    <h1 className={'roboto-flex-header responsive-header-h1'}>Создание квеста</h1>
                </div>
                    <Tabs items={items} />
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper className={'create-quest__content-wrapper'}>
            <div className={'create-quest__header__content'}>
                <Link href={'/'} style={{textDecoration: 'none', width: 'min-content'}} >
                    <Button className={'main-menu__button'} type={'link'} size={'middle'}>
                        <ArrowLeftOutlined />Вернуться на главную
                    </Button>
                </Link>
                <h1 className={'roboto-flex-header responsive-header-h1'}>Создание квеста</h1>
            </div>
            <div className={'create-quest__body__content'}>
                <section>
                    <h2 className={'roboto-flex-header'} style={{marginBottom: '16px'}}>Редактор</h2>
                    <QuestEditor form={form} fileList={fileList} setFileList={setFileList} accessToken={accessToken}/>
                </section>
                <div className={'content__separator'}/>
                <section>
                    <h2 className={'roboto-flex-header'} style={{ marginBottom: '16px' }}>Предпросмотр</h2>
                    <QuestPreview form={watch} file={fileListRef.current}/>
                </section>
            </div>
        </ContentWrapper>
    );
}
