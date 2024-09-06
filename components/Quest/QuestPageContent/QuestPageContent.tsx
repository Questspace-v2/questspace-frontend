import { QuestAdminPanel, QuestContent, QuestHeader, QuestResults, QuestTeam } from '@/components/Quest/Quest';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { QuestHeaderProps } from '@/components/Quest/Quest.helpers';
import {QuestDetailsDto} from '@/app/api/dto/quest-dto/quest-details.dto';

export default async function QuestPageContent({props, isCreator}: {props: QuestDetailsDto, isCreator: boolean}) {
    const {quest, team, leaderboard} = props;
    const session = await getServerSession(authOptions);
    return (
        <>
            <QuestAdminPanel isCreator={isCreator} />
            <QuestHeader props={quest as QuestHeaderProps} mode={'page'} team={team}/>
            <QuestResults status={quest.status} leaderboard={leaderboard}/>
            <QuestContent description={quest.description} mode={'page'} />
            <QuestTeam team={team} session={session} status={quest.status}/>
        </>
    );
}
