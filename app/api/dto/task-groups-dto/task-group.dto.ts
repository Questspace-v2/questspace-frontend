import {TaskDto} from '@/app/api/dto/task-groups-dto/task.dto';

export interface TaskGroupDto {
    name: string;
    tasks: TaskDto[];
    id?: string;
    order_idx?: number;
    pub_time?: string;
}