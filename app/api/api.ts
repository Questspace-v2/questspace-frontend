import { IPasswordUpdate, ISignIn, IUser, IUserCreate, IUserUpdate } from '@/app/types/user-interfaces';
import { IQuest, IQuestCreate } from '@/app/types/quest-interfaces';
import { BadRequest, Forbidden, HttpError, NotFound, UnsupportedMediaType } from 'http-errors';

const BACKEND_URL = 'https://millionaire-web.ru';

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

export const getQuestById = (id: string) => {
    fetch(`${BACKEND_URL}/quest/${id}`)
        .then(response => response.body)
        .catch(err => {
            throw err;
        })
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
                throw new UnsupportedMediaType('UnsupportedMediaType');
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
                throw new UnsupportedMediaType('UnsupportedMediaType');
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

        if (response.ok) { // Тут еще navigate() зачем-то был
            return await response.json() as IUser;
        }

        switch (response.status) {
            case 400:
                throw new BadRequest('Bad request');
            case 403:
                throw new Forbidden('Forbidden');
            case 415:
                throw new UnsupportedMediaType('UnsupportedMediaType');
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
                throw new UnsupportedMediaType('UnsupportedMediaType');
            default:
                throw new HttpError('Unknown error');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const updateQuest = async (id: string, data: IQuestCreate) => {
    await fetch(`${BACKEND_URL}/quest/${id}`, {method: 'POST', credentials: 'include', body: JSON.stringify(data)});
};

export const updateUser = async (id: string, data: IUserUpdate) => {
    await fetch(`${BACKEND_URL}/user/${id}`, {method: 'POST', credentials: 'include', body: JSON.stringify(data)});
};

export const updatePassword = async (id: string, data: IPasswordUpdate) => {
    await fetch(`${BACKEND_URL}/user/${id}/password`, {method: 'POST', credentials: 'include', body: JSON.stringify(data)});
};

export const deleteQuest = async (id: string) => {
    await fetch(`${BACKEND_URL}/quest/${id}`, {method: 'DELETE', credentials: 'include'})
        .then(response => response.json());
};

export const deleteUser = async (id: string) => {
    await fetch(`${BACKEND_URL}/user/${id}`, {method: 'DELETE', credentials: 'include'})
        .then(response => response.json());
};
