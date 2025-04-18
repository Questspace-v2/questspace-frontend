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
import {
    IEditPenaltyRequest,
    IHintRequest,
    IQuestCreate,
    IBulkEditTaskGroups,
    ITaskAnswer,
    ITaskGroupsCreateRequest,
} from '@/app/types/quest-interfaces';
import { RcFile } from 'antd/es/upload';
import uploadToS3 from '../uploadToS3';

interface IBaseInit {
    method: string,
    body?: string,
    credentials?: string,
    headers?: Record<string, string>,
}

type DataType = Data | IUserCreate| IUserUpdate | IBulkEditTaskGroups|
    IQuestCreate | IPasswordUpdate| ITaskGroupsCreateRequest | ITaskAnswer |
    IHintRequest | IEditPenaltyRequest | string;

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
        data?: DataType,
        credentials?: string,
        headers?: Record<string, string>
    ) {
        const baseInit: IBaseInit = {
            headers,
            method,
            credentials,
        }

        if (data && method !== 'GET' && method !== 'DELETE') {
            baseInit.body = JSON.stringify(data);
        }

        return baseInit as RequestInit;
    }

    static buildQueryString(params = {}) {
        return new URLSearchParams(params).toString();
    }

    async handleServerRequest(
        endpoint = '/',
        method = 'GET',
        data?: DataType, // Жесть, потом придумаю получше
        queryParams?: Record<string, unknown>,
        credentials = 'same-origin',
        headers: Record<string, string> = {},
        returnsNoBody = false
    ) {
        const paramsString = Client.buildQueryString(queryParams);
        const url = paramsString ? `${this.backendUrl}${endpoint}?${paramsString}` : `${this.backendUrl}${endpoint}`;
        const config = Client.buildConfig(method, data, credentials, headers);

        return fetch(url, config)
            .then(res => {
                if (res.ok) {
                    return method !== 'DELETE' && !returnsNoBody ? res.json() : res.status;
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
        body: string | Blob | RcFile,
    ) {
        const formData = new FormData();
        if (typeof body === 'string') {
            const response = await fetch(body);
            const blob = await response.blob();
            formData.append('file', blob, 'filename.jpg');
        } else if (body instanceof Blob) {
            formData.append('file', body, 'filename.jpg');
        } else {
            formData.append('file', body);
        }

        try {
            const result = await uploadToS3(decodeURIComponent(key), fileType, formData);
            return result;
        } catch (err) {
            this.handleError(err as HttpError);
            if (this.error) {
                throw this.error;
            }
            throw createHttpError('Unknown error');
        }
    }
}

const client = new Client();
export default client;
