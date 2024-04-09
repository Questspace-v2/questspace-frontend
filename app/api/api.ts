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

export const updateQuest = async (questId: string, data: IQuestCreate) =>
    client.handleServerRequest(`/quest/${questId}`, 'POST', data);


export const updateUser = async (id: string, data: IUserUpdate, accessToken: string) =>
    client.handleServerRequest(`/user/${id}`, 'POST', data, undefined,'same-origin', {'Authorization': `Bearer ${accessToken}`});

export const updatePassword = async (id: string, data: IPasswordUpdate, accessToken: string) =>
    client.handleServerRequest(`/user/${id}/password`, 'POST', data, undefined,'same-origin', {'Authorization': `Bearer ${accessToken}`});

export const deleteQuest = async (questId: string) =>
    client.handleServerRequest(`/quest/${questId}`, 'DELETE');

export const deleteUser = async (userId: string) =>
    client.handleServerRequest(`/user/${userId}`, 'DELETE');

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

export const joinTeam = async (invitePath: string) =>
    client.handleServerRequest(`/teams/join/${invitePath}`);

export const getTeamById = async (teamId: string) =>
    client.handleServerRequest(`/teams/${teamId}`);

export const updateTeam = async (teamId: string, data: { name: string }) =>
    client.handleServerRequest(`/teams/${teamId}`, 'POST', data);

export const deleteTeam = async (teamId: string) =>
    client.handleServerRequest(`/teams/${teamId}`, 'DELETE');

export const changeTeamCaptain = async (teamId: string, data: { new_captain_id: string }) =>
    client.handleServerRequest(`/teams/${teamId}/captain`, 'POST', data);

export const leaveTeam = async (teamId: string, new_captain_id?: string) =>
    client.handleServerRequest(`/teams/${teamId}/leave`, 'POST', new_captain_id && new_captain_id);

export const removeTeamMember = async (teamId: string, memberId: string) =>
    client.handleServerRequest(`/teams/${teamId}/${memberId}`, 'DELETE');
