import axios, { AxiosInstance } from 'axios';
import API_URL from './settings';

export const createAPI = (): AxiosInstance => {
    const api = axios.create({
        baseURL: API_URL,
        timeout: 5000,
    });

    return api;
};
