import axios, { AxiosError, AxiosInstance } from 'axios';
import { BadRequestError, HttpError, NotFoundError, TooManyRequestsError } from './custom-errors';

export const BACKEND_URL = 'https://millionaire-web.ru';

const onResponseError = (error: AxiosError): Promise<HttpError> => {
    switch (error.response?.status) {
        case 400:
            throw new BadRequestError('Bad request');
        case 404:
            throw new NotFoundError('Not found');
        case 429:
            throw new TooManyRequestsError('Too many requests');
        default:
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
