import { getPaginatedAnswerLogs, getQuestTeams } from '@/app/api/api';
import { IGetAllTeamsResponse, IPaginatedAnswerLogs, IPaginatedAnswerLogsParams } from '@/app/types/quest-interfaces';
import { getServerSession } from 'next-auth';
import { unstable_noStore as noStore } from 'next/cache';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { LOGS_PAGE_SIZE } from '@/components/QuestAdmin/Logs/Logs';
import LogsTabClient from './LogsTabClient';

export default async function LogsTab({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const paramsForLogs: IPaginatedAnswerLogsParams = {
    desc: true,
    page_size: LOGS_PAGE_SIZE // Используем вашу константу
  };

  noStore();
  const [logsData, teamsData] = await Promise.all([
    getPaginatedAnswerLogs(params.id, session?.accessToken, paramsForLogs) as Promise<IPaginatedAnswerLogs>,
    getQuestTeams(params.id) as Promise<IGetAllTeamsResponse>
  ]);

  return (
    <LogsTabClient
      initialTeams={teamsData.teams}
      initialLogs={logsData}
      questId={params.id}
    />
  );
}