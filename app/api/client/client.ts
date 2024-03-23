import { BACKEND_URL } from '@/app/api/client/constants';
import createHttpError, {
    BadRequest,
    Forbidden,
    HttpError,
    NotFound,
    Unauthorized,
    UnprocessableEntity,
    UnsupportedMediaType,
} from 'http-errors';
import { Data } from '@/app/types/json-data';
import { IPasswordUpdate, IUserCreate, IUserUpdate } from '@/app/types/user-interfaces';
import { IQuestTaskGroups } from '@/app/types/quest-interfaces';
import { RcFile } from 'antd/es/upload';

class Client {
    backendUrl: string;

    error: HttpError | null;

    constructor() {
        this.backendUrl = BACKEND_URL;
        this.error = null;
    }

    handleError(error: HttpError) {
        if (error.statusCode === 200) {
            this.error = null;
            return;
        }
        switch (error.statusCode) {
            case 400:
                this.error = new BadRequest('Bad request');
                break;
            case 401:
                this.error = new Unauthorized('Unauthorized');
                break;
            case 403:
                this.error = new Forbidden('Forbidden');
                break;
            case 404:
                this.error = new NotFound('Not found');
                break;
            case 415:
                this.error = new UnsupportedMediaType('Unsupported media type');
                break;
            case 422:
                this.error = new UnprocessableEntity('Unprocessable entity');
                break;
            default:
                this.error = createHttpError('Unknown error');
        }
    }

    static buildConfig(
        method: string,
        data: Data | IUserCreate| IUserUpdate | IQuestTaskGroups| IPasswordUpdate| string,
        credentials: string,
        headers?: Record<string, string>
    ) {
        const baseInit = {
            headers,
            method,
            credentials,
            body: {}
        }

        if (method !== 'GET' && method !== 'DELETE') {
            baseInit.body = JSON.stringify(data);
        }

        return baseInit as RequestInit;
    }

    async handleServerRequest(
        endpoint = '/',
        method = 'GET',
        data: Data | IUserCreate| IUserUpdate | IQuestTaskGroups| IPasswordUpdate| string = {}, // Жесть, потом придумаю получше
        credentials = 'same-origin',
        headers: Record<string, string> = {}
    ) {
        const url = `${this.backendUrl}${endpoint}`;
        const config = Client.buildConfig(method, data, credentials, headers);

        return fetch(url, config)
            .then(res => res.json())
            .catch((err: HttpError) => {
                this.handleError(err);
                if (this.error) {
                    throw this.error;
                }
                throw createHttpError('Unknown error');
            });
    }

    async handleS3Request(
        key: string,
        fileType: string,
        body: string | Blob | RcFile,
        method = 'PUT'
    ) {
        const headers: Record<string, string> = {
            'Content-Type': fileType
        };

        const s3Config = {
            method,
            headers,
            body
        };

        return fetch(
            `https://storage.yandexcloud.net/questspace-img/${key}`,
            {...s3Config}
        )
            .then(res => res)
            .catch((err: HttpError) => {
                this.handleError(err);
                if (this.error) {
                    throw this.error;
                }
                throw createHttpError('Unknown error');
            });
    }
}

const client = new Client();
export default client;