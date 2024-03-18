import { IPasswordUpdate, ISignIn, IUser, IUserCreate, IUserUpdate } from '@/app/types/user-interfaces';
import { IQuest, IQuestCreate, IQuestTaskGroups, IQuestTaskGroupsResponse } from '@/app/types/quest-interfaces';
import {
    BadRequest,
    Forbidden,
    HttpError,
    NotFound,
    Unauthorized,
    UnprocessableEntity,
    UnsupportedMediaType,
} from 'http-errors';

export const BACKEND_URL = 'https://millionaire-web.ru';

export const getUserById = async (id: string) => {
    try {
        const response = await fetch(`${BACKEND_URL}/user/${id}`);

        if (response.ok) {
            return await response.json() as IUser;
        }

        throw new NotFound('Not found');
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getQuestById = async (id: string) => {
    try {
        const response = await fetch(`${BACKEND_URL}/quest/${id}`);

        if (response.ok) {
            return await response.json() as IQuest;
        }

        throw new NotFound('Not found');
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const authWithGoogle = async (token: string) => {
    try {
        const response = await fetch(`${BACKEND_URL}/auth/google`, {
            method: 'POST',
            credentials: 'include',
            body: token
        });

        if (response.ok) {
            return await response.json() as IUser;
        }

        switch (response.status) {
            case 400:
                throw new BadRequest('Bad request');
            case 403:
                throw new Forbidden('Forbidden');
            case 415:
                throw new UnsupportedMediaType('Unsupported media type');
            default:
                throw new HttpError('Unknown error');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const authSignUp = async (data: IUserCreate) => {
    try {
        const response = await fetch(`${BACKEND_URL}/auth/register`, {
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        });

        if (response.ok) { // navigate()
            return await response.json() as IUser;
        }

        switch (response.status) {
            case 400:
                throw new BadRequest('Bad request');
            case 403:
                throw new Forbidden('Forbidden');
            case 415:
                throw new UnsupportedMediaType('Unsupported media type');
            default:
                throw new HttpError('Unknown error');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const authSignIn = async (data: ISignIn) => {
    try {
        const response = await fetch(`${BACKEND_URL}/auth/sign-in`, {
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        });

        if (response.ok) {
            return await response.json() as IUser;
        }

        switch (response.status) {
            case 400:
                throw new BadRequest('Bad request');
            case 403:
                throw new Forbidden('Forbidden');
            case 415:
                throw new UnsupportedMediaType('Unsupported media type');
            default:
                throw new HttpError('Unknown error');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const createQuest = async (data: IQuestCreate) => {
    try {
        const response = await fetch(`${BACKEND_URL}/quest`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(data)
        });

        if (response.ok) {
            return await response.json() as IQuest;
        }

        switch (response.status) {
            case 400:
                throw new BadRequest('Bad request');
            case 403:
                throw new Forbidden('Forbidden');
            case 415:
                throw new UnsupportedMediaType('Unsupported media type');
            default:
                throw new HttpError('Unknown error');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const updateQuest = async (id: string, data: IQuestCreate) => {
    try {
        const response = await fetch(`${BACKEND_URL}/quest/${id}`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(data)
        });

        if (response.ok) {
            return await response.json() as IQuest;
        }

        switch (response.status) {
            case 401:
                throw new Unauthorized('Unauthorized');
            case 403:
                throw new Forbidden('Forbidden');
            case 404:
                throw new NotFound('Not found');
            case 415:
                throw new UnsupportedMediaType('Unsupported media type');
            default:
                throw new HttpError('Unknown error');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const updateUser = async (id: string, data: IUserUpdate) => {
    try {
        const response = await fetch(`${BACKEND_URL}/user/${id}`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(data)
        });

        if (response.ok) {
            return await response.json() as IUser;
        }

        switch (response.status) {
            case 401:
                throw new Unauthorized('Unauthorized');
            case 403:
                throw new Forbidden('Forbidden');
            case 404:
                throw new NotFound('Not found');
            case 422:
                throw new UnprocessableEntity('Unprocessable entity');
            default:
                throw new HttpError('Unknown error');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const updatePassword = async (id: string, data: IPasswordUpdate) => {
    try {
        const response = await fetch(`${BACKEND_URL}/user/${id}/password`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(data)
        });

        if (response.ok) {
            return await response.json() as IUser;
        }

        switch (response.status) {
            case 401:
                throw new Unauthorized('Unauthorized');
            case 403:
                throw new Forbidden('Forbidden');
            default:
                throw new HttpError('Unknown error');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const deleteQuest = async (id: string) => {
    try {
        const response = await fetch(`${BACKEND_URL}/quest/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        switch (response.status) {
            case 200:
                return;
            case 401:
                throw new Unauthorized('Unauthorized');
            case 403:
                throw new Forbidden('Forbidden');
            case 404:
                throw new NotFound('Not found');
            default:
                throw new HttpError('Unknown error');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const deleteUser = async (id: string) => {
    try {
        const response = await fetch(`${BACKEND_URL}/user/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        switch (response.status) {
            case 200:
                return;
            case 401:
                throw new Unauthorized('Unauthorized');
            case 403:
                throw new Forbidden('Forbidden');
            case 404:
                throw new NotFound('Not found');
            default:
                throw new HttpError('Unknown error');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const patchTaskGroups = async (id: string, data: IQuestTaskGroups) => {
    try {
        const response = await fetch(`${BACKEND_URL}/quest/${id}/task-groups/bulk`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });

        if (response.ok) {
            return await response.json() as IQuestTaskGroupsResponse;
        }

        switch (response.status) {
            case 400:
                throw new BadRequest('Bad request');
            case 401:
                throw new Unauthorized('Unauthorized');
            case 403:
                throw new Forbidden('Forbidden');
            default:
                throw new HttpError('Unknown error');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};
