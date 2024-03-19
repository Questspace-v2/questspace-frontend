import { BACKEND_URL } from '@/app/api/client/constants';
import {
    BadRequest,
    Forbidden,
    HttpError,
    NotFound,
    Unauthorized,
    UnprocessableEntity,
    UnsupportedMediaType,
} from 'http-errors';
import { Data } from '@/app/types/json-data';

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
                this.error = new HttpError('Unknown error');
        }
    }

    static buildConfig(method: string, data: Data | string, credentials: string) {
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

    async handleServerRequest(
        endpoint = '/',
        method = 'GET',
        data: Data | string = {},
        credentials = 'same-origin'
    ) {
        const url = `${this.backendUrl}${endpoint}`;
        const config = Client.buildConfig(method, data, credentials);

        return fetch(url, config)
            .then(res => res.json())
            .catch((err: HttpError) => {
                this.handleError(err);
                if (this.error) {
                    throw this.error;
                }
                throw HttpError('Unknown error');
            });
    }

    async handleS3Request() {

    }
}

const client = new Client();
export default client;