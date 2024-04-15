'use client'

import React, { useMemo, useState } from 'react';
import Markdown from 'react-markdown';
import {
    CalendarOutlined,
    ClockCircleTwoTone,
    CopyOutlined,
    EditOutlined,
    HourglassOutlined,
    LogoutOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';

import './Quest.css';
import { Button, Card, ConfigProvider, message, Modal, Skeleton } from 'antd';
import {
    getQuestStatusButton,
    getStartDateText,
    getTimeDiff,
    QuestHeaderProps,
    QuestStatus,
} from '@/components/Quest/Quest.helpers';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ITeam } from '@/app/types/user-interfaces';
import Image from 'next/image';
import { TeamModalType, uid } from '@/lib/utils/utils';
import dynamic from 'next/dynamic';
import { changeTeamCaptain, deleteTeamMember, leaveTeam } from '@/app/api/api';
import { Session } from 'next-auth';
import { redOutlinedButton } from '@/lib/theme/themeConfig';
import { RELEASED_FEATURE } from '@/app/api/client/constants';


const DynamicCreateTeam = dynamic(() => import('@/components/Quest/CreateTeam/CreateTeam'), {
    ssr: false,
})

const DynamicInviteModal = dynamic(() => import('@/components/Quest/InviteModal/InviteModal'), {
    ssr: false,
})

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
    const [aspectRatio, setAspectRatio] = useState('2/1');
    const [currentModal, setCurrentModal] = useState<TeamModalType>(null);
    if (!props) {
        return null;
    }

    const {
        id,
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
            height={1000}
            style={{ width: '100%', objectFit: 'contain', height: 'auto' }}
            alt={'quest avatar'}
            loading={'eager'}
            onLoad={({ target }) => {
                const { naturalWidth, naturalHeight } = target as HTMLImageElement;
                if (naturalWidth > naturalHeight * 2) {
                    setAspectRatio(`${naturalWidth} / ${naturalHeight}`);
                }
            }}
        />;


        return (
            <ContentWrapper className={'quest-header__wrapper'}>
                <Card
                    className={'quest-header'}
                    cover={imageNode}
                    bordered={false}
                    styles={{cover: {aspectRatio}}}
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
                    {getQuestStatusButton(startDate, registrationDate, finishDate, status, currentModal, setCurrentModal, id, team)}
                    <DynamicCreateTeam questId={id} currentModal={currentModal} setCurrentModal={setCurrentModal}/>
                    {team?.invite_link && <DynamicInviteModal inviteLink={team.invite_link} currentModal={currentModal} setCurrentModal={setCurrentModal}/>}
                </Card>
            </ContentWrapper>
        );
    }

    if (mode === 'edit') {
        return (
            <>
                {mediaLink &&
                    <div className={'quest-image__container'} style={{aspectRatio}}>
                        <Image
                            className={'quest-image__image'}
                            src={mediaLink}
                            width={1000}
                            height={1000}
                            alt={'quest image'}
                            onLoad={({ target }) => {
                                const { naturalWidth, naturalHeight } = target as HTMLImageElement;
                                if (naturalWidth > naturalHeight * 2) {
                                    setAspectRatio(`${naturalWidth} / ${naturalHeight}`);
                                }
                            }}
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

function QuestTeam({team, session} : {team?: ITeam, session?: Session | null}) {
    const router = useRouter();
    const [modal, modalContextHolder] = Modal.useModal();
    const [messageApi, contextHolder] = message.useMessage();

    if (!team) {
        return null;
    }

    const teamName = team.name;
    const inviteLink = team.invite_link;

    const success = () => {
        // eslint-disable-next-line no-void
        void messageApi.open({
            type: 'success',
            content: 'Скопировано!',
        });
    };

    const showConfirm = async () => {
        await modal.confirm({
            title: 'Вы хотите выйти из команды?',
            icon: <ExclamationCircleOutlined />,
            className: 'confirm-delete__modal',
            cancelText: 'Нет',
            cancelButtonProps: {type: 'primary'},
            okText: 'Да',
            okType: 'default',
            centered: true,
            async onOk() {
                const captainId = team.captain.id;
                const isCaptain = captainId === session?.user.id;
                if (isCaptain) {
                    const newCaptainId = team.members.filter(member => member.id !== captainId)[0]?.id;
                    await leaveTeam(team.id, session?.accessToken, newCaptainId ?? undefined);
                } else {
                    await leaveTeam(team.id, session?.accessToken);
                }
                router.refresh();
            }
        }).then(confirmed => confirmed ? router.refresh() : {}, () => {});
    };

    const deleteMember = async (memberId: string) => {
        await deleteTeamMember(team.id, memberId, session?.accessToken);
        router.refresh();
    };

    const changeCaptain = async (newCaptainId: string) => {
        await changeTeamCaptain(team.id, {new_captain_id: newCaptainId}, session?.accessToken);
        router.refresh();
    };

    return (
        <ContentWrapper className={'quest-page__content-wrapper quest-page__team'}>
            {contextHolder}
            <div className={'team__header'}>
                <h2 className={'roboto-flex-header responsive-header-h2'}>{`Твоя команда — ${teamName}`}</h2>
                <Button
                    className={'exit-team__button exit-team__large-screen'}
                    type={'text'}
                    icon={<LogoutOutlined style={{ color: 'var(--quit-color)' }} />}
                    style={{ color: 'var(--quit-color)' }}
                    onClick={showConfirm}
                >
                    Выйти из команды
                </Button>
                {modalContextHolder}
            </div>
            <div className={'team__members'}>
                {team.members.map((member) => (
                    <div key={uid()} className={`team-member__wrapper ${member.id === team.captain.id ? 'team-member__captain' : ''}`}>
                        <Image src={member.avatar_url} alt={'member avatar'} width={128} height={128} style={{borderRadius: '50%'}}/>
                        <span className={'team-member__name'}>{member.username}</span>
                        {
                            RELEASED_FEATURE && session?.user.id === team.captain.id && member.id !== team.captain.id &&
                            <>
                                <Button onClick={() => changeCaptain(member.id)}>Сделать капитаном</Button>
                                <Button onClick={() => deleteMember(member.id)}>Удалить участника</Button>
                            </>
                        }
                    </div>
                    )
                )}
            </div>
            <div className={'invite-link__wrapper'}>
                <p className={'invite-link__text'}>Пригласи друзей в свою команду — поделись ссылкой:</p>
                <Button className={'invite-link__link'} type={'link'} onClick={() => {
                    navigator.clipboard.writeText(inviteLink).then(() => success()).catch(err => {throw err});
                }}>{inviteLink} <CopyOutlined style={{marginInlineStart: '3px'}} /></Button>
            </div>
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
            <ConfigProvider theme={redOutlinedButton}>
                <Button
                    className={'exit-team__button exit-team__small-screen'}
                    icon={<LogoutOutlined style={{ color: 'var(--quit-color)' }}/>}
                    style={{ color: 'var(--quit-color)' }}
                    block
                    onClick={showConfirm}
                >
                    Выйти из команды
                </Button>
            </ConfigProvider>
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
