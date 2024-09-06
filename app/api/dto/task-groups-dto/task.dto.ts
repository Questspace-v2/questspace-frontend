import {HintDto} from '@/app/api/dto/task-groups-dto/hint.dto';

export interface TaskDto {
    correct_answers: string[],
    hints: HintDto[] | string[],
    name: string,
    pub_time: string,
    question: string,
    reward: number,
    verification_type: string,
    answer?: string
    id?: string,
    media_link?: string,
    order_idx?: number,
}