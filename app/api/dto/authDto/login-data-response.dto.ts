import {UserDto} from '@/app/api/dto/userDto/user.dto';

export interface LoginDataResponseDto {
    readonly access_token: string;
    readonly user: UserDto;
}