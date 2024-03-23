import { IPasswordUpdate, ISignIn, IUser, IUserCreate, IUserUpdate } from '@/app/types/user-interfaces';
import { IQuest, IQuestCreate, IQuestTaskGroups, IQuestTaskGroupsResponse } from '@/app/types/quest-interfaces';
import client from '@/app/api/client/client';

export const getUserById = async (id: string) =>
    await client.handleServerRequest(`/user/${id}`) as IUser;

export const getQuestById = async (id: string) =>
    await client.handleServerRequest(`/quest/${id}`) as IQuest;

export const authWithGoogle = async (token: string) =>
    await client.handleServerRequest('/auth/google', 'POST', token) as IUser;

export const authSignUp = async (data: IUserCreate) =>
    await client.handleServerRequest('/auth/register', 'POST', data) as IUser;

export const authSignIn = async (data: ISignIn) =>
    await client.handleServerRequest('/auth/sign-in', 'POST', data) as IUser;

export const createQuest = async (data: IQuestCreate) =>
    await client.handleServerRequest('/quest', 'POST', data) as IQuest;

export const updateQuest = async (id: string, data: IQuestCreate) =>
    await client.handleServerRequest(`/quest/${id}`, 'POST', data) as IQuest;

export const updateUser = async (id: string, data: IUserUpdate, accessToken: string) =>
    await client.handleServerRequest(`/user/${id}`, 'POST', data, 'same-origin', {'Authorization': `Bearer ${accessToken}`}) as IUser;

export const updatePassword = async (id: string, data: IPasswordUpdate) =>
    await client.handleServerRequest(`/user/${id}/password`, 'POST', data) as IUser;

export const deleteQuest = async (id: string) =>
    client.handleServerRequest(`/quest/${id}`, 'DELETE');

export const deleteUser = async (id: string) =>
    client.handleServerRequest(`/user/${id}`, 'DELETE');

export const patchTaskGroups = async (id: string, data: IQuestTaskGroups) =>
    await client.handleServerRequest(`/quest/${id}/task-groups/bulk`, 'PATCH', data) as IQuestTaskGroupsResponse;
