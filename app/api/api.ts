import { IPasswordUpdate, ISignIn, IUserCreate, IUserUpdate } from '@/app/types/user-interfaces';
import { IQuestCreate } from '@/app/types/quest-interfaces';
import navigate from '@/app/actions';

const BACKEND_URL = 'https://millionaire-web.ru';

export const getUserById = (id: string) => {
    fetch(`${BACKEND_URL}/user/${id}`)
        .then(response => response.body)
        .catch(err => {
            throw err;
        });
};

export const getQuestById = (id: string) => {
    fetch(`${BACKEND_URL}/quest/${id}`)
        .then(response => response.body)
        .catch(err => {
            throw err;
        })
};

export const authWithGoogle = async (token: string) => {
    await fetch(`${BACKEND_URL}/auth/google`, {method: 'POST', credentials: 'include', body: token});
};

export const signUp = async (data: IUserCreate) => {
    await fetch(`${BACKEND_URL}/auth/register`, {method: 'POST', credentials: 'same-origin', body: JSON.stringify(data)})
        .catch(reason => {
            console.error(`Error while fetching: ${reason}`)
            throw reason;
        })
        .then(response => response.status === 200 ? navigate() : console.log(response.json()));
};

export const signIn = async (data: ISignIn) => {
    await fetch(`${BACKEND_URL}/auth/sign-in`, {method: 'POST', credentials: 'same-origin', body: JSON.stringify(data)})
        .catch(reason => {
            console.error(`Error while fetching: ${reason}`)
            throw reason;
        })
        .then(response => response.status === 200 ? navigate() : console.log(response.json()));
};

export const createQuest = async (data: IQuestCreate) => {
    await fetch(`${BACKEND_URL}/quest`, {method: 'POST', credentials: 'include', body: JSON.stringify(data)});
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
