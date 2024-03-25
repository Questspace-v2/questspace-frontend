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
import { IQuestCreate, IQuestTaskGroups } from '@/app/types/quest-interfaces';

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
        data?: Data | IUserCreate| IUserUpdate | IQuestTaskGroups| IQuestCreate| IPasswordUpdate| string,
        credentials?: string
    ) {
        const baseInit = {
            method,
            credentials,
            body: {}
        }

        if (method !== 'GET' && method !== 'DELETE') {
            baseInit.body = JSON.stringify(data);
        }

        return baseInit as RequestInit;
    }

    static buildQueryString(params = {}) {
        const searchParams = new URLSearchParams(params);
        return searchParams.toString();
    }

    async handleServerRequest(
        endpoint = '/',
        method = 'GET',
        data?: Data | IUserCreate| IUserUpdate | IQuestTaskGroups| IQuestCreate | IPasswordUpdate| string, // Жесть, потом придумаю получше
        queryParams = {},
        credentials = 'same-origin'
    ) {
        const paramsString = Client.buildQueryString(queryParams);
        const url = paramsString ? `${this.backendUrl}${endpoint}?${paramsString}` : `${this.backendUrl}${endpoint}`;
        const config = Client.buildConfig(method, data, credentials);

        return fetch(url, config)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return null;
            })
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
        method = 'PUT'
    ) {
        const headers: Record<string, string> = {
            'Content-Type': fileType
        };

        const s3Config = {
            method,
            headers
        };

        return fetch(
            `https://storage.yandexcloud.net/questspace-img/users/${key}`,
            s3Config
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
