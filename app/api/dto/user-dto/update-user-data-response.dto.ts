import {UserDto} from '@/app/api/dto/user-dto/user.dto';

export interface UpdateUserDataResponseDto {
    readonly access_token: string;
    readonly user: UserDto;
}