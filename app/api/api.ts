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

export const getQuestById = async (questId: string) =>
    client.handleServerRequest(`/quest/${questId}`);

export const authWithGoogle = async (token: string) =>
    client.handleServerRequest('/auth/google', 'POST', token);

export const authRegister = async (data: IUserCreate) =>
    client.handleServerRequest('/auth/register', 'POST', data);

export const authSignIn = async (data: ISignIn) =>
    client.handleServerRequest('/auth/sign-in', 'POST', data);

export const createQuest = async (data: IQuestCreate) =>
    client.handleServerRequest('/quest', 'POST', data);

export const updateQuest = async (questId: string, data: IQuestCreate) =>
    client.handleServerRequest(`/quest/${questId}`, 'POST', data);

export const updateUser = async (userId: string, data: IUserUpdate) =>
    client.handleServerRequest(`/user/${userId}`, 'POST', data);

export const updatePassword = async (userId: string, data: IPasswordUpdate) =>
    client.handleServerRequest(`/user/${userId}/password`, 'POST', data);

export const deleteQuest = async (questId: string) =>
    client.handleServerRequest(`/quest/${questId}`, 'DELETE');

export const deleteUser = async (userId: string) =>
    client.handleServerRequest(`/user/${userId}`, 'DELETE');

export const patchTaskGroups = async (questId: string, data: IQuestTaskGroups) =>
    client.handleServerRequest(`/quest/${questId}/task-groups/bulk`, 'PATCH', data);

export const getFilteredQuests = async (fields: string[], page_id?: string, page_size = 50) =>
    client.handleServerRequest('/quest', 'GET', undefined, {
        ...fields,
        page_size,
        page_id
    });

export const getQuestTeams = async (questId: string) =>
    client.handleServerRequest(`/quest/${questId}/teams`);

export const createTeam = async (questId: string, data: { name: string }) =>
    client.handleServerRequest(`/quest/${questId}/teams`, 'POST', data);

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
