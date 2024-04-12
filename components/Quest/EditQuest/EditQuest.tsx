'use client';

import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';

import './EditQuest.css';
import { Button, Form, Tabs, TabsProps, UploadFile } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { useEffect, useRef, useState } from 'react';
import QuestPreview from '@/components/Quest/EditQuest/QuestPreview/QuestPreview';
import QuestEditor, { QuestAboutForm } from '@/components/Quest/EditQuest/QuestEditor/QuestEditor';
import { IGetQuestResponse } from '@/app/types/quest-interfaces';
import dayjs from 'dayjs';

export default function EditQuest({questData} : {questData?: IGetQuestResponse}) {
    const [selectedTab, setSelectedTab] = useState<string>('editor');
    const [form] = Form.useForm<QuestAboutForm>();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const fileListRef = useRef(fileList[0]);

    useEffect(() => {
        if (questData) {
            const {quest} = questData;
            const {
                name,
                description,
                finish_time: finishTime,
                start_time: startTime,
                access,
                media_link: image,
                max_team_cap: maxTeamCap,
                registration_deadline: registrationDeadline
            } = quest;

            const formProps: QuestAboutForm = {
                // @ts-expect-error жалуется на dayjs
                name, description, finishTime: dayjs(finishTime), access, startTime: dayjs(startTime), image, maxTeamCap, registrationDeadline: dayjs(registrationDeadline)
            }
            form.setFieldsValue(formProps);
        }
        // eslint-disable-next-line prefer-destructuring
        fileListRef.current = fileList[0];
    }, [fileList, form, questData]);

    const watch = Form.useWatch([], form);
    const {xs, sm, md} = useBreakpoint();

    const items: TabsProps['items'] = [
        {
            key: 'editor',
            label: 'Редактор',
            children: <QuestEditor form={form} fileList={fileList} setFileList={setFileList}/>,
        },
        {
            key: 'preview',
            label: 'Предпросмотр',
            children: <QuestPreview form={watch} file={fileListRef.current}/>,
        },
    ];

    if (xs === undefined) {
        return null;
    }

    if (xs || (sm && !md)) {
        return (
            <ContentWrapper className={'edit-quest__content-wrapper'}>
                <div className={'edit-quest__header__content'}>
                    <Link href={'/'} style={{textDecoration: 'none', width: 'min-content'}} >
                        <Button className={'return__button'} type={'link'} size={'middle'}>
                            <ArrowLeftOutlined />Вернуться на главную
                        </Button>
                    </Link>
                    <h1 className={'roboto-flex-header responsive-header-h1'}>Создание квеста</h1>
                </div>
                <Tabs items={items} activeKey={selectedTab} onTabClick={setSelectedTab}/>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper className={'edit-quest__content-wrapper'}>
            <div className={'edit-quest__header__content'}>
                <Link href={'/'} style={{textDecoration: 'none', width: 'min-content'}} >
                    <Button className={'return__button'} type={'link'} size={'middle'}>
                        <ArrowLeftOutlined />Вернуться на главную
                    </Button>
                </Link>
                <h1 className={'roboto-flex-header responsive-header-h1'}>Создание квеста</h1>
            </div>
            <div className={'edit-quest__body__content'}>
                <section>
                    <h2 className={'roboto-flex-header'} style={{marginBottom: '16px'}}>Редактор</h2>
                    <QuestEditor form={form} fileList={fileList} setFileList={setFileList}/>
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
