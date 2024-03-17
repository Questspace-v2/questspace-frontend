'use client'

import { useMemo } from 'react';
import Markdown from 'react-markdown';
import { ClockCircleTwoTone } from '@ant-design/icons';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { IQuest } from '@/app/types/quest-interfaces';

import './Quest.css';
import { Skeleton } from 'antd';
import QuestCard, { QuestHeaderProps } from '@/components/QuestCard/QuestCard';

const parseToMarkdown = (str?: string): string => str?.replaceAll('\\n', '\n') ?? '';

interface QuestContentProps {
    description?: string;
}

function QuestHeader({props}: {props?: QuestHeaderProps}) {
    if (!props) {
        return null;
    }

    return <QuestCard mode={'full'} props={props} />;
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
            <Markdown className={'line-break'} disallowedElements={['pre', 'code']}>{afterParse?.toString()}</Markdown>
            </Skeleton>
        </ContentWrapper>
    );
}

export default function Quest({props}: {props: IQuest}) {
    return (
        <>
            <QuestHeader props={props} />
            <QuestResults />
            <QuestContent description={props.description}/>
        </>
    );
}
