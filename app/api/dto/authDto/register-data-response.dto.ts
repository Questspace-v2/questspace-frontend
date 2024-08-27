import {UserDto} from '@/app/api/dto/userDto/user.dto';

export interface RegisterDataResponseDto {
    readonly access_token: string;
    readonly user: UserDto;
}