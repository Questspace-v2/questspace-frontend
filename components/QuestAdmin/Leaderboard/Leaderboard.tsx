import { uid } from '@/lib/utils/utils';
import {IAdminLeaderboardResponse} from "@/app/types/quest-interfaces";

export default function Leaderboard({teams}: {teams: IAdminLeaderboardResponse}) {
    // Здесь табличка с результатами по идее...
    return (
        <div>
            {teams?.results?.map(team => <div key={uid()}>{team.name}</div>)}
        </div>
    );
}
