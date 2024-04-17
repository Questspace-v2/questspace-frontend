import { uid } from '@/lib/utils/utils';
import { ITeam } from '@/app/types/user-interfaces';

export default function Leaderboard({teams}: {teams: ITeam[]}) {
    // Здесь табличка с результатами по идее...
    return (
        <div>
            {teams?.map(team => <div key={uid()}>{team.name}</div>)}
        </div>
    );
}
