import {AdminLeaderboardResultDto} from '@/app/api/dto/play-mode-dto/admin-leaderboard-result.dto';
import {AdminTaskGroupDto} from '@/app/api/dto/task-groups-dto/admin-task-group.dto';

export interface AdminLeaderboardResponseDto {
    readonly results: readonly AdminLeaderboardResultDto[];
    readonly task_groups?: readonly AdminTaskGroupDto[];
}