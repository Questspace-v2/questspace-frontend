'use client'

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Markdown from 'react-markdown';
import { ClockCircleTwoTone } from '@ant-design/icons';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { IQuest } from '@/app/types/quest-interfaces';
import { IUser } from '@/app/types/user-interfaces';
import { BACKEND_URL } from '@/app/api/api';

import './Quest.css';
import { Skeleton } from 'antd';

const parseToMarkdown = (str?: string): string => str?.replaceAll('\\n', '\n') ?? '';

interface QuestHeaderProps {
    creator: IUser,
    start_time: string,
    finish_time: string,
    media_link: string,
    name: string,
    registration_deadline: string,
}

interface QuestContentProps {
    description?: string;
}

function QuestHeader(props: QuestHeaderProps) {
    if (props){
        const {
            creator,
            start_time: startTime,
            finish_time: finishTime,
            media_link: mediaLink,
            name,
            registration_deadline: registrationDeadline
        } = props;
        return (
            <ContentWrapper className={'quest-page__header'}>
                <Image src={'https://api.dicebear.com/7.x/thumbs/svg?seed=591f6fe1-d6cd-479b-a327-35f6b12a08fc'} width={100} height={100} alt={'quest avatar'}/>
                {name}
                {registrationDeadline}
                {startTime}
                {finishTime}
            </ContentWrapper>
        );
    }
    return null;
}

function QuestResults() {
    return (
        <ContentWrapper className={'quest-page__results'}>
            <h2 className={'roboto-flex-header'}>Результаты квеста</h2>
            <div className={'results__content_waiting'}>
                <ClockCircleTwoTone />
                <h6 className={'results__title'}>Ждем результаты</h6>
            </div>
        </ContentWrapper>
    );
}

function QuestContent({description} : QuestContentProps) {
    const afterParse = useMemo(() => parseToMarkdown(description), [description]);

    return (
        <ContentWrapper className={'quest-page__content'}>
            <h2 className={'roboto-flex-header'}>О квесте</h2>
            <Skeleton paragraph loading={!afterParse}>
            <Markdown className={'line-break'}>{afterParse?.toString()}</Markdown>
            </Skeleton>
        </ContentWrapper>
    );
}

export default function Quest({id}: {id: string}) {
    const [questData, setQuestData] = useState<IQuest>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Your asynchronous code here, for example:
                const response = await fetch(`${BACKEND_URL}/quest/${id}`);
                const data : IQuest = await response.json() as IQuest;
                setQuestData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // eslint-disable-next-line no-void
        void fetchData(); // Invoke the async function immediately
    }, [id]);

    return (
        <>
            <QuestHeader {...questData} />
            <QuestResults />
            <QuestContent description={questData?.description}/>
        </>
    );
}
