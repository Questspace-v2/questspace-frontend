import {UserDto} from '@/app/api/dto/user-dto/user.dto';

export interface GoogleDataDto {
    readonly id_token: string;
}

export interface AuthResponseDto {
    readonly access_token: string;
    readonly user: UserDto;
}

export interface LoginDataDto {
    readonly password: string;
    readonly username: string;
}

export interface RegisterDataDto {
    readonly password: string;
    readonly username: string;
    readonly avatar_url?: string;
}