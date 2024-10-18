'use client';

import { useEffect, useRef, useState } from 'react';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { Button, Form, Tabs, TabsProps, UploadFile } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import QuestPreview from '@/components/Quest/EditQuest/QuestPreview/QuestPreview';
import QuestEditor, { QuestAboutForm } from '@/components/Quest/EditQuest/QuestEditor/QuestEditor';
import { IQuest, IQuestTaskGroups } from '@/app/types/quest-interfaces';
import dayjs from 'dayjs';

function EditQuestHeader({isNewQuest}: {isNewQuest: boolean}) {
    if (isNewQuest) {
        return (
            <div className={'edit-quest__header__content'}>
                <Link href={'/'} style={{ textDecoration: 'none', width: 'min-content' }}>
                    <Button className={'return__button'} type={'link'} size={'middle'}>
                        <ArrowLeftOutlined />Вернуться на главную
                    </Button>
                </Link>
                <h1 className={'roboto-flex-header responsive-header-h1'}>Создание квеста</h1>
            </div>
        );
    }
    return null;
}

export default function EditQuest({ questData, setContextData }: { questData?: IQuest, setContextData?: React.Dispatch<React.SetStateAction<IQuestTaskGroups>> }) {
    const [selectedTab, setSelectedTab] = useState<string>('editor');
    const [form] = Form.useForm<QuestAboutForm>();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const fileListRef = useRef(fileList[0]);
    const watch = Form.useWatch([], form);
    const {xs, sm, md} = useBreakpoint();

    useEffect(() => {
        if (questData) {
            const {
                name,
                description,
                finish_time: finishTime,
                start_time: startTime,
                access,
                media_link: image,
                max_team_cap: maxTeamCap,
                registration_deadline: registrationDeadline,
                max_teams_amount: maxTeamsAmount = null,
                registration_type: registrationType = 'AUTO',
            } = questData;

            const formProps: QuestAboutForm = {
                name,
                description,
                // @ts-expect-error жалуется на dayjs
                finishTime: dayjs(finishTime), startTime: dayjs(startTime), registrationDeadline: dayjs(registrationDeadline),
                access,
                image,
                maxTeamCap,
                maxTeamsAmount,
                registrationType
            }
            form.setFieldsValue(formProps);
        }
        // eslint-disable-next-line prefer-destructuring
        fileListRef.current = fileList[0];
    }, [fileList, form, questData]);

    const editor =
        <QuestEditor form={form}
                     fileList={fileList}
                     setFileList={setFileList}
                     isNewQuest={!questData}
                     questId={questData?.id}
                     previousImage={questData?.media_link}
                     initialTeamCapacity={questData?.max_team_cap}
                     setContextData={setContextData}
        />;
    const preview =
        <QuestPreview
            form={watch}
            file={fileListRef.current}
            previousImage={questData?.media_link}
        />;

    const items: TabsProps['items'] = [
        {
            key: 'editor',
            label: 'Редактор',
            children: editor,
        },
        {
            key: 'preview',
            label: 'Предпросмотр',
            children: preview,
        },
    ];

    if (xs === undefined) {
        return null;
    }

    if (xs || (sm && !md)) {
        return (
            <ContentWrapper className={'edit-quest__content-wrapper'}>
                <EditQuestHeader isNewQuest={!questData}/>
                <Tabs items={items} activeKey={selectedTab} onTabClick={setSelectedTab}/>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper className={'edit-quest__content-wrapper'}>
            <EditQuestHeader isNewQuest={!questData}/>
            <div className={'edit-quest__body__content'}>
                <section>
                    <h2 className={'roboto-flex-header'} style={{marginBottom: '6px'}}>Редактор</h2>
                    {editor}
                </section>
                <div className={'content__separator'}/>
                <section>
                    <h2 className={'roboto-flex-header'} style={{ marginBottom: '22px' }}>Предпросмотр</h2>
                    {preview}
                </section>
            </div>
        </ContentWrapper>
    );
}
