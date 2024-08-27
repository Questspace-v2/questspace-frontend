import {RegisterDataDto} from '@/app/api/dto/authDto/register-data.dto';
import {BACKEND_URL} from '@/app/api/client/constants';
import wretch from 'wretch'
import {LoginDataDto} from '@/app/api/dto/authDto/login-data.dto';
import {RegisterDataResponseDto} from '@/app/api/dto/authDto/register-data-response.dto';
import {LoginDataResponseDto} from '@/app/api/dto/authDto/login-data-response.dto';
import {GoogleDataDto} from '@/app/api/dto/authDto/google-data.dto';
import {GoogleDataResponseDto} from '@/app/api/dto/authDto/google-data-response.dto';

class AuthService {
    private readonly endpoints = {
        register: `${BACKEND_URL}/auth/register`,
        login: `${BACKEND_URL}/auth/sign-in`,
        google: `${BACKEND_URL}/auth/google`,
    };

    public async register(data: RegisterDataDto): Promise<RegisterDataResponseDto> {
        const url = this.endpoints.register;
        return wretch(url)
            .post(data)
            .json()
            .then(response => response as RegisterDataResponseDto);
    }

    public async login(data: LoginDataDto): Promise<LoginDataResponseDto> {
        const url = this.endpoints.login;
        return wretch(url)
            .post(data)
            .json()
            .then(response => response as LoginDataResponseDto);
    }

    public async authWithGoogle(data: GoogleDataDto): Promise<GoogleDataResponseDto> {
        const url = this.endpoints.google;
        return wretch(url)
            .post(data)
            .json()
            .then(response => response as GoogleDataResponseDto);
    }
}

export default AuthService;