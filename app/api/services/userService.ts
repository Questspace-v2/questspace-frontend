import {BACKEND_URL} from '@/app/api/client/constants';
import wretch from 'wretch';
import {UserDto} from '@/app/api/dto/userDto/user.dto';
import {UpdateUserDataDto} from '@/app/api/dto/userDto/update-user-data.dto';
import {UpdateUserDataResponseDto} from '@/app/api/dto/userDto/update-user-data-response.dto';
import {UpdatePasswordDataDto} from '@/app/api/dto/userDto/update-password-data.dto';

class UserService {
    private readonly baseUsersUrl = `${BACKEND_URL}/users`;

    public async getUserById(id: string): Promise<UserDto> {
        const url = `${this.baseUsersUrl}/${id}`;
        return wretch(url)
            .get()
            .json()
            .then(response => response as UserDto);
    }

    public async updateUserData(
        id: string,
        data: UpdateUserDataDto,
        accessToken: string
    ): Promise<UpdateUserDataResponseDto> {
        const url = `${this.baseUsersUrl}/${id}`;
        return wretch(url)
            .auth(`Bearer ${accessToken}`)
            .post(data)
            .json()
            .then(response => response as UpdateUserDataResponseDto);
    }

    public async updatePassword(
        id: string,
        data: UpdatePasswordDataDto,
        accessToken: string
    ): Promise<UserDto> {
        const url = `${this.baseUsersUrl}/${id}/password`;
        return wretch(url)
            .auth(`Bearer ${accessToken}`)
            .post(data)
            .json()
            .then(response => response as UserDto);
    }
}

export default UserService;