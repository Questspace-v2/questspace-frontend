import { getQuestTeams } from '@/app/api/api';
import { IGetAllTeamsResponse } from '@/app/types/quest-interfaces';
import { unstable_noStore as noStore } from 'next/cache';
import TeamsTabClient from './TeamsTabClient';


export default async function TeamsTab({ params }: { params: { id: string } }) {
    noStore();
    const teamsData = await getQuestTeams(params.id) as IGetAllTeamsResponse;

    return (
        <TeamsTabClient
            initialTeams={teamsData.teams ?? []}
            questId={params.id}
        />
    );
}