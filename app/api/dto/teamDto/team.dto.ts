import {UserDto} from '@/app/api/dto/userDto/user.dto';

export interface TeamDto {
    readonly captain: UserDto,
    readonly id: string,
    readonly invite_link: string,
    readonly members: readonly UserDto[],
    readonly name: string,
    readonly score: number
}