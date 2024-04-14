import { IGetQuestResponse } from '@/app/types/quest-interfaces';
import { QuestAdminPanel, QuestContent, QuestHeader, QuestResults, QuestTeam } from '@/components/Quest/Quest';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth';

export default async function QuestPageContent({props, isCreator}: {props: IGetQuestResponse, isCreator: boolean}) {
    const {quest, team} = props;
    const session = await getServerSession(authOptions);
    return (
        <>
            <QuestAdminPanel isCreator={isCreator} />
            <QuestHeader props={quest} mode={'page'} team={team}/>
            <QuestResults status={quest.status} />
            <QuestContent description={quest.description} mode={'page'} />
            <QuestTeam team={team} session={session}/>
        </>
    );
}
