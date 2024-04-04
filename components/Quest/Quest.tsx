'use client'

import { useMemo } from 'react';
import Markdown from 'react-markdown';
import { ClockCircleTwoTone, CopyOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { IQuest } from '@/app/types/quest-interfaces';

import './Quest.css';
import { Button, message, Skeleton } from 'antd';
import { QuestHeaderProps, QuestStatus } from '@/components/QuestCard/QuestCard.helpers';
import QuestCard from '@/components/QuestCard/QuestCard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const parseToMarkdown = (str?: string): string => str?.replaceAll('\\n', '\n') ?? '';

interface QuestContentProps {
    description?: string;
}

function QuestAdminPanel() {
    const currentPath = usePathname();

    return (
        <ContentWrapper className={'quest-page__admin-panel'}>
            <p>Сейчас вы смотрите на квест как обычный пользователь Квестспейса</p>
            <Link shallow href={`${currentPath}/edit`}>
                <Button type={'link'} size={'large'} style={{color: '#1890FF'}}><EditOutlined/>Редактировать квест</Button>
            </Link>

        </ContentWrapper>
    );
}

function QuestHeader({props}: {props?: QuestHeaderProps}) {
    if (!props) {
        return null;
    }

    return <QuestCard mode={'full'} props={props} />;
}

function QuestResults({status} : {status: QuestStatus | string}) {
    const statusQuest = status as QuestStatus;
    if (statusQuest === QuestStatus.StatusWaitResults || statusQuest === QuestStatus.StatusFinished) {
        return (
            <ContentWrapper className={'quest-page__content-wrapper quest-page__results'}>
                <h2 className={'roboto-flex-header responsive-header-h2'}>Результаты квеста</h2>
                {statusQuest === QuestStatus.StatusWaitResults && (
                    <div className={'results__content_waiting'}>
                        <ClockCircleTwoTone />
                        <h6 className={'results__title'}>Ждем результаты</h6>
                    </div>
                )}
            </ContentWrapper>
        );
    }

    return null;
}

function QuestTeam() {
    const teamName = 'Швейцария еще как существует';
    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        // eslint-disable-next-line no-void
        void messageApi.open({
            type: 'success',
            content: 'Скопировано!',
        });
    };

    return (
        <ContentWrapper className={'quest-page__content-wrapper quest-page__team'}>
            {contextHolder}
            <div className={'team__header'}>
                <h2 className={'roboto-flex-header responsive-header-h2'}>{`Твоя команда — ${teamName}`}</h2>
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
                    navigator.clipboard.writeText('хуй').then(() => success()).catch(err => {throw err});
                }}>questspace.app/invites/BROLDY <CopyOutlined style={{marginInlineStart: '3px'}} /></Button>

            </div>
        </ContentWrapper>
    );
}

function QuestContent({ description }: QuestContentProps) {
    const afterParse = useMemo(() => parseToMarkdown(description), [description]);

    return (
        <ContentWrapper className={'quest-page__content-wrapper quest-page__content'}>
            <h2 className={'roboto-flex-header responsive-header-h2'}>О квесте</h2>
            <Skeleton paragraph loading={!afterParse}>
            <Markdown className={'line-break'} disallowedElements={['pre', 'code']}>{afterParse?.toString()}</Markdown>
            </Skeleton>
        </ContentWrapper>
    );
}

export default function Quest({props, isCreator}: {props: IQuest, isCreator: boolean}) {
    return (
        <>
            {isCreator && (
                <QuestAdminPanel />
            )}
            <QuestHeader props={props} />
            <QuestResults status={props.status} />
            <QuestContent description={props.description} />
            <QuestTeam />
        </>
    );
}
