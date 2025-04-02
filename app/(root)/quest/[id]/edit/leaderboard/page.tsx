import { getLeaderboardAdmin } from '@/app/api/api';
import { IAdminLeaderboardResponse } from '@/app/types/quest-interfaces';
import { getServerSession } from 'next-auth';
import { unstable_noStore as noStore } from 'next/cache';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import LeaderboardTabClient from './LeaderboardTabClient';

export default async function LeaderboardTab({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  noStore();
  const leaderboardData = await getLeaderboardAdmin(
    params.id,
    session?.accessToken
  ) as IAdminLeaderboardResponse;

  return (
    <LeaderboardTabClient
      initialLeaderboard={leaderboardData}
    />
  );
}