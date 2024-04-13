import {
    IPasswordUpdate,
    ISignIn,
    IUserCreate,
    IUserUpdate,
} from '@/app/types/user-interfaces';
import { IQuestCreate, IQuestTaskGroups } from '@/app/types/quest-interfaces';
import client from '@/app/api/client/client';

export const getUserById = async (userId: string) =>
    client.handleServerRequest(`/user/${userId}`);

export const getQuestById = async (questId: string, accessToken?: string) =>
    client.handleServerRequest(`/quest/${questId}`, 'GET', undefined,
        undefined, 'same-origin', accessToken ? {'Authorization': `Bearer ${accessToken}`} : {});

export const authWithGoogle = async (token: string) =>
    client.handleServerRequest('/auth/google', 'POST', {id_token: token});

export const authRegister = async (data: IUserCreate) =>
    client.handleServerRequest('/auth/register', 'POST', data);

export const authSignIn = async (data: ISignIn) =>
    client.handleServerRequest('/auth/sign-in', 'POST', data);

export const createQuest = async (data: IQuestCreate, accessToken: string) =>
    client.handleServerRequest('/quest', 'POST', data,
        undefined, 'same-origin', {'Authorization': `Bearer ${accessToken}`});

export const updateQuest = async (questId: string, data: IQuestCreate, accessToken?: string) =>
    client.handleServerRequest(`/quest/${questId}`, 'POST', data, undefined,
        'same-origin', accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {});


export const updateUser = async (id: string, data: IUserUpdate, accessToken: string) =>
    client.handleServerRequest(`/user/${id}`, 'POST', data, undefined,'same-origin', {'Authorization': `Bearer ${accessToken}`});

export const updatePassword = async (id: string, data: IPasswordUpdate, accessToken: string) =>
    client.handleServerRequest(`/user/${id}/password`, 'POST', data, undefined,'same-origin', {'Authorization': `Bearer ${accessToken}`});

export const deleteQuest = async (questId: string, accessToken?: string) =>
    client.handleServerRequest(`/quest/${questId}`, 'DELETE', undefined, undefined,
        'same-origin', accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {});

export const deleteUser = async (userId: string, accessToken?: string) =>
    client.handleServerRequest(`/user/${userId}`, 'DELETE', undefined, undefined,
        'same-origin', accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {});

export const patchTaskGroups = async (questId: string, data: IQuestTaskGroups) =>
    client.handleServerRequest(`/quest/${questId}/task-groups/bulk`, 'PATCH', data);

export const getFilteredQuests = async (fields: string[], accessToken?: string, page_id?: string, page_size = '50') => {
    const params: Record<string, unknown> = {
        fields,
        page_size,
    }

    if (page_id) {
        params.page_id = page_id
    }

    return client.handleServerRequest(
        '/quest',
        'GET',
        undefined,
        params,
        'same-origin',
        accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}
    );
}

export const getQuestTeams = async (questId: string) =>
    client.handleServerRequest(`/quest/${questId}/teams`);

export const createTeam = async (questId: string, data: { name: string }, accessToken?: string) =>
    client.handleServerRequest(`/quest/${questId}/teams`, 'POST', data,
        undefined, 'same-origin',
        accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {});

export const joinTeam = async (invitePath: string, accessToken?: string) =>
    client.handleServerRequest(`/teams/join/${invitePath}`, 'GET', undefined, undefined,
        'same-origin', accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {});

export const getQuestByTeamInvite = async (invitePath: string, accessToken?: string) =>
    client.handleServerRequest(`/teams/join/${invitePath}/quest`,
        'GET', undefined, undefined, 'same-origin',
        accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {});

export const getTeamById = async (teamId: string) =>
    client.handleServerRequest(`/teams/${teamId}`);

export const updateTeam = async (teamId: string, data: { name: string }, accessToken?: string) =>
    client.handleServerRequest(`/teams/${teamId}`, 'POST', data, undefined,
        'same-origin', accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {});

export const deleteTeam = async (teamId: string, accessToken?: string) =>
    client.handleServerRequest(`/teams/${teamId}`, 'DELETE', undefined, undefined,
        'same-origin', accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {});

export const changeTeamCaptain = async (teamId: string, data: {
    new_captain_id: string
}, accessToken?: string) =>
    client.handleServerRequest(`/teams/${teamId}/captain`, 'POST', data, undefined,
        'same-origin', accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {});

export const leaveTeam = async (teamId: string, accessToken?: string, new_captain?: string) =>
    client.handleServerRequest(`/teams/${teamId}/leave`, 'POST', undefined,
        new_captain ? {new_captain} : undefined,
        'same-origin', accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {});

export const deleteTeamMember = async (teamId: string, memberId: string, accessToken?: string) =>
    client.handleServerRequest(`/teams/${teamId}/${memberId}`, 'DELETE', undefined,
        undefined, 'same-origin', accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {});
