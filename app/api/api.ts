import {
    ISignIn,
} from '@/app/types/user-interfaces';
import {
    ITaskGroupsCreateRequest,
} from '@/app/types/quest-interfaces';
import client from '@/app/api/client/client';

export const authSignIn = async (data: ISignIn) =>
    client.handleServerRequest('/auth/sign-in', 'POST', data);

export const createTaskGroupsAndTasks = async (questId: string, data: ITaskGroupsCreateRequest, accessToken?: string) =>
    client.handleServerRequest(`/quest/${questId}/task-groups`, 'POST', data, undefined,
        'same-origin', accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {});

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

export const changeTeamCaptain = async (teamId: string, data: {
    new_captain_id: string
}, accessToken?: string) =>
    client.handleServerRequest(`/teams/all/${teamId}/captain`, 'POST', data, undefined,
        'same-origin', accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {});

export const leaveTeam = async (teamId: string, accessToken?: string, new_captain?: string) =>
    client.handleServerRequest(`/teams/all/${teamId}/leave`, 'POST', undefined,
        new_captain ? {new_captain} : undefined,
        'same-origin', accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {});

export const deleteTeamMember = async (teamId: string, memberId: string, accessToken?: string) =>
    client.handleServerRequest(`/teams/all/${teamId}/${memberId}`, 'DELETE', undefined,
        undefined, 'same-origin', accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {});

export const getTaskGroupsAdmin = async (questId: string, accessToken?: string) =>
    client.handleServerRequest(`/quest/${questId}/task-groups`, 'GET', undefined,
        undefined, 'same-origin', accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
