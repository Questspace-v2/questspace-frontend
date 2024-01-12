import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from './store';
import { AxiosInstance } from 'axios';
import { IUser, IUserUpdate } from './types/user-interfaces';

export const getUser = createAsyncThunk<IUser, string, {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
}>(
    'getUser',
    async (id: string, {extra: api}) => { // Тут надо будет разобраться с землей из джсона
        const {data} = await api.get<IUser>(`/user/${id}`);
        return data;
    }
);

export const createUser = createAsyncThunk<IUser, IUser, {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
}>(
    'createUser',
    async (user: IUser, {extra: api}) => {
        const {data} = await api.post<IUser>('/user', user);
        return data;
    }
);

export const updateUser = createAsyncThunk<IUser, IUserUpdate, {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
}>(
    'updateUser',
    async (user: IUserUpdate, {extra: api}) => {
        const request: Omit<IUserUpdate, 'id'> = {
            username: user.username,
            avatarUrl: user.avatarUrl,
            oldPassword: user.oldPassword,
            newPassword: user.newPassword
        };

        const {data} = await api.post<IUser>(`/user/${user.id}`, request);
        return data;
    }
);
