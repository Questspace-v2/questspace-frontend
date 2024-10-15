import React from 'react';
import { IGetQuestResponse } from '@/app/types/quest-interfaces';
import QuestHeader from '@/components/Quest/QuestHeader/QuestHeader';
import QuestDescription from '@/components/Quest/QuestDescription/QuestDescription';
import QuestAdminPanel from '@/components/Quest/QuestAdminPanel/QuestAdminPanel';
import QuestParticipantsWrapper from '@/components/Quest/QuestParticipantsWrapper/QuestParticipantsWrapper';


export default function QuestMainPage({props, isCreator}: {props: IGetQuestResponse, isCreator: boolean}) {
    const {quest, team, leaderboard, all_teams: allTeams} = props;

    return (
        <>
            <QuestAdminPanel isCreator={isCreator} />
            <QuestHeader props={quest} mode={'page'} team={team} teamsAccepted={(allTeams ?? []).length}/>
            <QuestDescription description={quest.description} mode={'page'} />
            <QuestParticipantsWrapper status={quest.status} leaderboard={leaderboard} team={team} allTeams={allTeams}/>
        </>
    );
}
