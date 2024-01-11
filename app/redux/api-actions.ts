import { createAsyncThunk } from '@reduxjs/toolkit';
import { IUser } from '../api/client-handler';
import { AppDispatch, RootState } from './store';
import { AxiosInstance } from 'axios';

export const getUser = createAsyncThunk<IUser, string, {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
}>(
    'getUser',
    async (id: string, {extra: api}) => {
        const {data} = await api.get<IUser>(`/user/${id}`);
        return data;
    }
);

export const createUser = createAsyncThunk<void, IUser, {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
}>(
    'createUser',
    async ({username, password}, {extra: api}) => {
        await api.post('/user', {username, password});
    }
);

export const updateUser = createAsyncThunk<void, IUser, {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
}>(
    'updateUser',
    async ({id, password, username}: IUser, {extra: api}, avatarUrl = '', newPassword = '') => {
        const request: IUser = {
            id,
            username,
            password,
            newPassword,
            avatarUrl
        };

        await api.post(`/user/${id}`, request);
    }
);
