import { IGetQuestResponse } from '@/app/types/quest-interfaces';
import { QuestAdminPanel, QuestContent, QuestHeader, QuestResults, QuestTeam } from '@/components/Quest/Quest';

export default function QuestPageContent({props, isCreator}: {props: IGetQuestResponse, isCreator: boolean}) {
    const {quest, team} = props;
    return (
        <>
            <QuestAdminPanel isCreator={isCreator} />
            <QuestHeader props={quest} mode={'page'} />
            <QuestResults status={quest.status} />
            <QuestContent description={quest.description} mode={'page'} />
            <QuestTeam team={team} />
        </>
    );
}
