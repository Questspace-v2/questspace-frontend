import {AdminTaskDto} from '@/app/api/dto/task-groups-dto/admin-task.dto';

export interface AdminTaskGroupDto {
    id: string;
    name: string;
    tasks: AdminTaskDto[];
    order_idx: number;
}