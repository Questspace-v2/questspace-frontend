import { QuestStatus } from '@/components/Quest/Quest.helpers';
import { IFinalLeaderboard } from '@/app/types/quest-interfaces';
import { ITeam } from '@/app/types/user-interfaces';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import QuestResults from '@/components/Quest/QuestResults/QuestResults';
import React from 'react';
import QuestTeam from '@/components/Quest/QuestTeam/QuestTeam';
import QuestAllTeams from '@/components/Quest/QuestAllTeams/QuestAllTeams';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth';

interface QuestParticipantsWrapperProps {
    status: QuestStatus | string,
    leaderboard?: IFinalLeaderboard,
    team?: ITeam,
    allTeams?: ITeam[],
}

export default async function QuestParticipantsWrapper({ status, leaderboard, team, allTeams }: QuestParticipantsWrapperProps) {
    const questIsFinished = status as QuestStatus === QuestStatus.StatusFinished;
    const session = await getServerSession(authOptions);

    return (
        <ContentWrapper className={'quest-page__content-wrapper'}>
            <h2 className={'roboto-flex-header responsive-header-h2'}>{questIsFinished ? 'Результаты квеста' : 'Участники квеста'}</h2>
            <QuestTeam mode={'collapse'} status={status} team={team} session={session} />
            {questIsFinished ?
                <QuestResults status={status} leaderboard={leaderboard} /> :
                <QuestAllTeams allTeams={allTeams} currentTeam={team} />
            }
        </ContentWrapper>
    );
}
