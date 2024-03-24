import {
    IPasswordUpdate,
    ISignIn,
    IUserCreate,
    IUserUpdate,
} from '@/app/types/user-interfaces';
import { IQuestCreate, IQuestTaskGroups } from '@/app/types/quest-interfaces';
import client from '@/app/api/client/client';

export const getUserById = async (id: string) =>
    client.handleServerRequest(`/user/${id}`);

export const getQuestById = async (id: string) =>
    client.handleServerRequest(`/quest/${id}`);

export const authWithGoogle = async (token: string) =>
    client.handleServerRequest('/auth/google', 'POST', token);

export const authSignUp = async (data: IUserCreate) =>
    client.handleServerRequest('/auth/register', 'POST', data);

export const authSignIn = async (data: ISignIn) =>
    client.handleServerRequest('/auth/sign-in', 'POST', data);

export const createQuest = async (data: IQuestCreate) =>
    client.handleServerRequest('/quest', 'POST', data);

export const updateQuest = async (id: string, data: IQuestCreate) =>
    client.handleServerRequest(`/quest/${id}`, 'POST', data);

export const updateUser = async (id: string, data: IUserUpdate) =>
    client.handleServerRequest(`/user/${id}`, 'POST', data);

export const updatePassword = async (id: string, data: IPasswordUpdate) =>
    client.handleServerRequest(`/user/${id}/password`, 'POST', data);

export const deleteQuest = async (id: string) =>
    client.handleServerRequest(`/quest/${id}`, 'DELETE');

export const deleteUser = async (id: string) =>
    client.handleServerRequest(`/user/${id}`, 'DELETE');

export const patchTaskGroups = async (id: string, data: IQuestTaskGroups) =>
    client.handleServerRequest(`/quest/${id}/task-groups/bulk`, 'PATCH', data);
