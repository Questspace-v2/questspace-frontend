import { IGetQuestResponse } from '@/app/types/quest-interfaces';
import { QuestAdminPanel, QuestContent, QuestHeader, QuestResults, QuestTeam } from '@/components/Quest/Quest';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { isAllowedUser } from '@/lib/utils/utils';
import { QuestHeaderProps } from '@/components/Quest/Quest.helpers';

export default async function QuestPageContent({props, isCreator}: {props: IGetQuestResponse, isCreator: boolean}) {
    const {quest, team, leaderboard} = props;
    const session = await getServerSession(authOptions);
    return (
        <>
            {isAllowedUser(session ? session.user.id : '') && <QuestAdminPanel isCreator={isCreator} />}
            <QuestHeader props={quest as QuestHeaderProps} mode={'page'} team={team}/>
            <QuestResults status={quest.status} leaderboard={leaderboard}/>
            <QuestContent description={quest.description} mode={'page'} />
            <QuestTeam team={team} session={session}/>
        </>
    );
}
