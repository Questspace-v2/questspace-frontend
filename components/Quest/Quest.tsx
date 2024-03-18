'use client'

import { useMemo } from 'react';
import Markdown from 'react-markdown';
import { ClockCircleTwoTone, CopyOutlined, LogoutOutlined } from '@ant-design/icons';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { IQuest } from '@/app/types/quest-interfaces';

import './Quest.css';
import { Button, message, Skeleton } from 'antd';
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
        <ContentWrapper className={'content-wrapper__quest-page quest-page__results'}>
            <h2 className={'roboto-flex-header'}>Результаты квеста</h2>
            <div className={'results__content_waiting'}>
                <ClockCircleTwoTone />
                <h6 className={'results__title'}>Ждем результаты</h6>
            </div>
        </ContentWrapper>
    );
}

function QuestTeam() {
    const teamName = 'Швейцария еще как существует';
    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Скопировано!',
        });
    };

    return (
        <ContentWrapper className={'content-wrapper__quest-page quest-page__team'}>
            {contextHolder}
            <div className={'team__header'}>
                <h2 className={'roboto-flex-header'}>{`Твоя команда — ${teamName}`}</h2>
                <Button
                    className={'exit-team__button'}
                    type={'text'}
                    icon={<LogoutOutlined style={{ color: 'var(--quit-color)' }} />}
                    style={{ color: 'var(--quit-color)' }}
                >
                    Выйти из команды
                </Button>
            </div>
            <div className={'invite-link__wrapper'}>
                <p className={'invite-link__text'}>Пригласи друзей в свою команду — поделись ссылкой:</p>
                <Button className={'invite-link__link'} type={'link'} onClick={() => {
                    navigator.clipboard.writeText('хуй').then(() => success());
                }}>questspace.app/invites/BROLDY</Button>
                <CopyOutlined onClick={() => {
                    navigator.clipboard.writeText('хуй').then(() => success());
                }} style={{ color: 'var(--primary-color)' }} />
            </div>
        </ContentWrapper>
    );
}

function QuestContent({ description }: QuestContentProps) {
    const afterParse = useMemo(() => parseToMarkdown(description), [description]);

    return (
        <ContentWrapper className={'content-wrapper__quest-page quest-page__content'}>
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
            <QuestTeam />
        </>
    );
}
