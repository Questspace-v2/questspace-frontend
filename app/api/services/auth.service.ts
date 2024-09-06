import {
    AuthResponseDto,
    GoogleDataDto,
    LoginDataDto,
    RegisterDataDto,
} from '@/app/api/dto/auth-dto/auth';
import {BACKEND_URL} from '@/app/api/client/constants';


class AuthService {
    private readonly endpoints = {
        register: `${BACKEND_URL}/auth/register`,
        login: `${BACKEND_URL}/auth/sign-in`,
        google: `${BACKEND_URL}/auth/google`,
    };

    public async register(data: RegisterDataDto): Promise<AuthResponseDto> {
        const url = this.endpoints.register;
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(response => response.json())
            .then(response => response as AuthResponseDto);
    }

    public async login(data: LoginDataDto): Promise<AuthResponseDto> {
        const url = this.endpoints.login;
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(response => response.json())
            .then(response => response as AuthResponseDto);
    }

    public async authWithGoogle(data: GoogleDataDto): Promise<AuthResponseDto> {
        const url = this.endpoints.google;
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(response => response.json())
            .then(response => response as AuthResponseDto);
    }
}

export default AuthService;