'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from 'antd';
import Tasks from '@/components/Tasks/Tasks';
import { TasksMode } from '@/components/Tasks/Task/Task.helpers';
import { IQuestTaskGroupsResponse} from '@/app/types/quest-interfaces';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { ArrowLeftOutlined, HourglassOutlined, TeamOutlined } from '@ant-design/icons';
import { getLongTimeDiff, getRemainingVerb } from '@/components/Quest/Quest.helpers';
import classNames from 'classnames';
import dynamic from 'next/dynamic';

const Countdown = dynamic(() => import('../../CustomCountdown/CustomCountdown'), {
    ssr: false
})


export default function PlayPageContent({props}: {props: IQuestTaskGroupsResponse}) {
    const {name: teamName} = props.team;
    const {name: questName, id: questId, finish_time: finishTime, status, start_time: startTime} = props.quest;
    const nowDate = new Date();
    const timeLabel = getLongTimeDiff(nowDate, new Date(finishTime));
    const remainingVerb = getRemainingVerb(nowDate, new Date(finishTime));

    return (
        <div className={'play-page'}>
            <ContentWrapper className={'play-page__content-wrapper'}>
                <div className={'play-page__header__content'}>
                    <Link href={`/quest/${questId}`} style={{ textDecoration: 'none', width: 'min-content' }}>
                        <Button className={'return__button'} type={'link'} size={'middle'}>
                            <ArrowLeftOutlined />На страницу квеста
                        </Button>
                    </Link>
                    <h1 className={'roboto-flex-header responsive-header-h1'}>{questName}: Задания</h1>
                    <div className={'play-page__information'}>
                        <div className={'information__block'}>
                            <TeamOutlined />
                            <span className={'quest-header__start'}>{teamName}</span>
                        </div>
                        {status === 'RUNNING' && (
                            <div className={'information__block'}>
                                <HourglassOutlined />
                                <span className={'quest-header__start'}>
                                    {remainingVerb} {timeLabel}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </ContentWrapper>
            <div className={`play-page__tasks`}>
                {status === 'REGISTRATION_DONE' && (
                    <ContentWrapper className={classNames('tasks__content-wrapper')}>
                        <div className={'before-start__wrapper'}>
                            <h2 className={classNames('before-start__text', 'roboto-flex-header', 'responsive-header-h2')}>До старта</h2>
                            <Countdown className={classNames('before-start__countdown', 'roboto-flex-header')} date={new Date(startTime)} daysInHours />
                        </div>
                    </ContentWrapper>
                )}
                <Tasks mode={TasksMode.PLAY} props={props} />
            </div>
        </div>
    );
}
