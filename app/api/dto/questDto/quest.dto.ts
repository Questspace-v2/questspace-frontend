import {UserDto} from '@/app/api/dto/userDto/user.dto';

export interface QuestDto {
    readonly access: string,
    readonly creator: UserDto,
    readonly description: string,
    readonly finish_time: string | Date,
    readonly id: string,
    readonly max_team_cap: number,
    readonly media_link: string,
    readonly name: string,
    readonly registration_deadline: string | Date,
    readonly start_time: string | Date,
    readonly status: string
}