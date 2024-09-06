import {QuestDto} from '@/app/api/dto/quest-dto/quest.dto';
import {TaskGroupDto} from '@/app/api/dto/task-groups-dto/task-group.dto';
import {TeamDto} from '@/app/api/dto/team-dto/team.dto';

export interface TaskGroupsPlayModeResponseDto {
    readonly quest: QuestDto;
    readonly task_groups: readonly TaskGroupDto[],
    readonly team: TeamDto;
    readonly error?: string;
}