import {TaskGroupDto} from '@/app/api/dto/task-groups-dto/task-group.dto';

export interface CreateTaskGroupsDto {
    task_groups: TaskGroupDto[];
}