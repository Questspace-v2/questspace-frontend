import axios, { AxiosError, AxiosInstance } from 'axios';
import { BadRequestError, HttpError, NotFoundError, TooManyRequestsError } from './custom-errors';

export const BACKEND_URL = 'https://millionaire-web.ru';

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    switch (error.response?.status) {
        case 400:
            console.error('Bad request error');
            throw new BadRequestError('Bad request');
        case 404:
            console.error('Not found error');
            throw new NotFoundError('Not found');
        case 429:
            console.error('Too many requests error');
            throw new TooManyRequestsError('Too many requests');
        default:
            console.error('Unknown error');
            throw new HttpError(error.response?.status ?? 200);
    }
};

export const createAPI = (): AxiosInstance => {
    const api = axios.create({
        baseURL: BACKEND_URL,
        timeout: 5000,
    });

    api.interceptors.response.use(
        response => response,
        onResponseError
    )

    return api;
};
