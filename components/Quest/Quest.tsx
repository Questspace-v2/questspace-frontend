'use client'

import { useMemo } from 'react';
import Markdown from 'react-markdown';
import {
    CalendarOutlined,
    ClockCircleTwoTone,
    CopyOutlined,
    EditOutlined,
    HourglassOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';

import './Quest.css';
import { Button, Card, message, Skeleton } from 'antd';
import {
    getQuestStatusButton,
    getStartDateText,
    getTimeDiff,
    QuestHeaderProps,
    QuestStatus,
} from '@/components/Quest/Quest.helpers';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ITeam } from '@/app/types/user-interfaces';
import Image from 'next/image';

const parseToMarkdown = (str?: string): string => str?.replaceAll('\\n', '\n') ?? '';

interface QuestContentProps {
    description?: string;
    mode: 'page' | 'edit'
}

function QuestAdminPanel({isCreator} : {isCreator: boolean}) {
    const currentPath = usePathname();

    if (isCreator) {
        return (
            <ContentWrapper className={'quest-page__admin-panel'}>
                <p>Сейчас вы смотрите на квест как обычный пользователь Квестспейса</p>
                <Link shallow href={`${currentPath}/edit`}>
                    <Button type={'link'} size={'large'} style={{color: '#1890FF'}}><EditOutlined/>Редактировать квест</Button>
                </Link>

            </ContentWrapper>
        );
    }

    return null;
}

function QuestHeader({props, mode, team}: {props?: QuestHeaderProps, mode: 'page' | 'edit', team?: ITeam}) {
    if (!props) {
        return null;
    }

    const {
        name,
        start_time: startTime,
        creator ,
        registration_deadline: registrationDeadline,
        finish_time: finishTime,
        media_link: mediaLink,
        status
    } = props;
    const {username, avatar_url: avatarUrl} = creator;

    const registrationDate = new Date(registrationDeadline);
    const startDate = new Date(startTime);
    const finishDate = new Date(finishTime);
    const timeDiffLabel = getTimeDiff(startDate, finishDate);
    const startDateLabel = getStartDateText(startDate);

    if (mode === 'page') {
        const imageNode = <Image
            src={mediaLink}
            width={1000}
            height={500}
            style={{ width: '100%', objectFit: 'contain', height: 'auto' }}
            alt={'quest avatar'}
            loading={'eager'}
        />;

        return (
            <ContentWrapper className={'quest-header__wrapper'}>
                <Card
                    className={'quest-header'}
                    cover={imageNode}
                    bordered={false}
                >
                    <div className={'quest-header__text-content'}>
                        <h1 className={'quest-header__name roboto-flex-header responsive-header-h1'}>{name}</h1>
                        <div className={'quest-preview__information'}>
                            <div className={'information__block'}>
                                <Image src={avatarUrl} alt={'creator avatar'} priority draggable={false} width={16}
                                       height={16} style={{ borderRadius: '8px' }} />
                                <p>{username}</p>
                            </div>
                            <div className={'information__block'}>
                                <CalendarOutlined />
                                <p className={'quest-header__start'}>{startDateLabel}</p>
                            </div>
                            <div className={'information__block'}>
                                <HourglassOutlined />
                                <p className={'quest-header__start'}>{timeDiffLabel}</p>
                            </div>
                        </div>
                    </div>
                    {getQuestStatusButton(startDate, registrationDate, finishDate, status, team)}
                </Card>
            </ContentWrapper>
        );
    }

    if (mode === 'edit') {
        return (
            <>
                {mediaLink &&
                    <div className={'quest-image__container'}>
                        <Image
                            className={'quest-image__image'}
                            src={mediaLink}
                            width={1000}
                            height={500}
                            alt={'quest image'}
                        />
                    </div>
                }
                <h2 className={'roboto-flex-header'}>{name}</h2>
                <div className={'quest-header__text-content'}>
                    <div className={'quest-preview__information'}>
                        <div className={'information__block'}>
                            <Image src={avatarUrl} alt={'creator avatar'} priority draggable={false} width={16}
                                   height={16} style={{ borderRadius: '8px' }} />
                            <p>{username}</p>
                        </div>
                        {startTime && <div className={'information__block'}>
                            <CalendarOutlined />
                            <p className={'quest-header__start'}>{startDateLabel}</p>
                        </div>}
                        {startTime && finishTime && <div className={'information__block'}>
                            <HourglassOutlined />
                            <p className={'quest-header__start'}>{timeDiffLabel}</p>
                        </div>}
                    </div>
                </div>
            </>
        );
    }

    return null;
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

function QuestTeam({team} : {team?: ITeam}) {
    if (!team) {
        return null;
    }

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

function QuestContent({ description, mode}: QuestContentProps) {
    const afterParse = useMemo(() => parseToMarkdown(description), [description]);

    if (mode === 'page') {
        return (
            <ContentWrapper className={'quest-page__content-wrapper quest-page__content'}>
                <h2 className={'roboto-flex-header responsive-header-h2'}>О квесте</h2>
                <Skeleton paragraph loading={!afterParse}>
                    <Markdown className={'line-break'} disallowedElements={['pre', 'code']}>{afterParse?.toString()}</Markdown>
                </Skeleton>
            </ContentWrapper>
        );
    }

    if (mode === 'edit') {
        return (
            <>
                {description && <h2 className={'roboto-flex-header'}>О квесте</h2>}
                <Markdown className={'line-break'} disallowedElements={['pre', 'code']}>{description}</Markdown>
            </>
        );
    }

    return null;
}

export {QuestHeader, QuestContent, QuestAdminPanel, QuestResults, QuestTeam};
