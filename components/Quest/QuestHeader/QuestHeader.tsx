'use client';

import { ITeam } from '@/app/types/user-interfaces';
import React, { useState } from 'react';
import { TeamModalType } from '@/lib/utils/modalTypes';
import Image from 'next/image';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { Card } from 'antd';
import { CalendarOutlined, HourglassOutlined, TeamOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import {
    getQuestStatusButton,
    getStartDateText,
} from '@/components/Quest/QuestHeader/QuestHeader.helpers';
import { getTimeDiff } from '@/components/Quest/Quest.helpers';
import { IQuest } from '@/app/types/quest-interfaces';


const DynamicCreateTeam = dynamic(() => import('@/components/Quest/QuestTeam/CreateTeam/CreateTeam'), {
    ssr: false,
})

const DynamicInviteModal = dynamic(() => import('@/components/Quest/QuestTeam/InviteModal/InviteModal'), {
    ssr: false,
})

export type QuestHeaderProps = IQuest;

export default function QuestHeader({props, mode, team, teamsAccepted}: {
    props?: QuestHeaderProps,
    mode: 'page' | 'edit',
    team?: ITeam,
    teamsAccepted?: number
}) {
    const aspectRatio = '7/2';
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
        max_team_cap: maxTeamCap,
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
            width={1400}
            height={400}
            style={{ width: '100%', objectFit: 'cover', height: 'auto', userSelect: 'none', aspectRatio }}
            alt={''}
            aria-hidden
            loading={'eager'}
            fetchPriority={'high'}
            // onLoad={({ target }) => {
            //     const { naturalWidth, naturalHeight } = target as HTMLImageElement;
            //     if (naturalWidth > naturalHeight * 2) {
            //         setAspectRatio(`${naturalWidth} / ${naturalHeight}`);
            //     } else {
            //         setAspectRatio(`2/1`);
            //     }
            // }}
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
                                <Image src={avatarUrl} alt={'Автор квеста:'} priority draggable={false} width={16}
                                       height={16} style={{ borderRadius: '8px' }} />
                                <p>{username}</p>
                            </div>
                            <div className={'information__block'}>
                                <CalendarOutlined aria-hidden />
                                <span className="off-screen">Начало квеста: </span>
                                <p className={'quest-header__start'}>{startDateLabel}</p>
                            </div>
                            <div className={'information__block'}>
                                <HourglassOutlined aria-hidden />
                                <span className="off-screen">Длительность: </span>
                                <p className={'quest-header__start'}>{timeDiffLabel}</p>
                            </div>
                            <div className={'information__block'}>
                                <TeamOutlined aria-hidden />
                                <span className="off-screen">Ограничения по команде: </span><p className={'quest-header__start'}>макс. {maxTeamCap?.toString()} чел.</p>
                            </div>
                        </div>
                    </div>
                    {getQuestStatusButton(startDate, registrationDate, finishDate, currentModal, setCurrentModal, props, team, teamsAccepted)}
                    <DynamicCreateTeam questId={id} currentModal={currentModal} setCurrentModal={setCurrentModal}/>
                    {team?.invite_link && <DynamicInviteModal inviteLink={team.invite_link} currentModal={currentModal} setCurrentModal={setCurrentModal} />}
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
                            width={1400}
                            height={400}
                            alt={'quest image'}
                            // onLoad={({ target }) => {
                            //     const { naturalWidth, naturalHeight } = target as HTMLImageElement;
                            //     if (naturalWidth > naturalHeight * 2) {
                            //         setAspectRatio(`${naturalWidth} / ${naturalHeight}`);
                            //     } else {
                            //         setAspectRatio(`2/1`);
                            //     }
                            // }}
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
                        {maxTeamCap && <div className={'information__block'}>
                            <TeamOutlined />
                            <p className={'quest-header__start'}>макс. {maxTeamCap.toString()} чел.</p>
                        </div>}
                    </div>
                </div>
            </>
        );
    }

    return null;
}
