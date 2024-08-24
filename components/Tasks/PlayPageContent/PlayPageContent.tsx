import React from 'react';
import Link from 'next/link';
import { Button } from 'antd';
import Tasks from '@/components/Tasks/Tasks';
import { TasksMode } from '@/components/Tasks/Tasks.helpers';
import { IQuestTaskGroupsResponse} from '@/app/types/quest-interfaces';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';

import { ArrowLeftOutlined, HourglassOutlined, TeamOutlined } from '@ant-design/icons';

import './PlayPageContent.scss'
import { getLongTimeDiff, getRemainingVerb } from '@/components/Quest/Quest.helpers';

export default function PlayPageContent({props}: {props: IQuestTaskGroupsResponse}) {
    const {name: teamName} = props.team;
    const {name: questName, id: questId, finish_time: finishTime} = props.quest;
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
                        <div className={'information__block'}>
                            <HourglassOutlined />
                            <span className={'quest-header__start'}>
                                {remainingVerb} {timeLabel}
                            </span>
                        </div>
                    </div>
                </div>
            </ContentWrapper>
            <div className={`play-page__tasks`}>
                <Tasks mode={TasksMode.PLAY} props={props.task_groups} questId={questId} />
            </div>
        </div>
    );
}
