import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from './store';
import { AxiosInstance } from 'axios';
import { IUser, IUserCreate, IUserUpdate } from './types/user-interfaces';
import { Data } from './types/json-data';

export const getUser = createAsyncThunk<IUser, string, {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
}>(
    'getUser',
    async (id: string, { extra: api }) => {
        const { data } = await api.get<Data>(`/user/${id}`);
        const response: IUser = {
            id: data.id as string,
            username: data.username as string,
            avatarUrl: data.avatar_url as string,
        };

        return response;
    }
);

export const createUser = createAsyncThunk<IUser, IUserCreate, {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
}>(
    'createUser',
    async (user: IUserCreate, { extra: api }) => {
        const request: Data = {
            avatar_url: user.avatarUrl,
            password: user.password,
            username: user.username,
        };

        const { data } = await api.post<Data>('/user', request);

        const response: IUser = {
            id: data.id as string,
            username: data.username as string,
            avatarUrl: data.avatar_url as string,
        };

        return response;
    }
);

export const updateUser = createAsyncThunk<IUser, IUserUpdate, {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
}>(
    'updateUser',
    async (user: IUserUpdate, { extra: api }) => {
        const request: Data = {
            username: user.username,
            avatar_url: user.avatarUrl,
            old_password: user.oldPassword,
            new_password: user.newPassword
        };

        const { data } = await api.post<Data>(`/user/${user.id}`, request);

        const response: IUser = {
            id: data.id as string,
            username: data.username as string,
            avatarUrl: data.avatar_url as string,
        };

        return response;
    }
);
