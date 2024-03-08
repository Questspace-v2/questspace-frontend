import axios, { AxiosResponse } from 'axios';
import { IPasswordUpdate, ISignIn, IUser, IUserCreate, IUserUpdate } from '@/app/types/user-interfaces';
import { IQuest, IQuestCreate } from '@/app/types/quest-interfaces';

const BACKEND_URL = 'https://millionaire-web.ru';

const getUserById = (id: string) => {
    axios.get<IUser>(`${BACKEND_URL}/user/${id}`)
        .then((resp: AxiosResponse<IUser, IUser>) => resp.data)
        .catch((err) => {
            throw err;
        });
};

const getQuestById = (id: string) => {
    axios.get<IQuest>(`${BACKEND_URL}/quest/${id}`)
        .then((resp) => resp.data)
        .catch((err) => {
            throw err;
        })
};

const authWithGoogle = async (token: string) => {
    await axios.post(`${BACKEND_URL}/auth/google`, {token});
};

const signUp = async (data: IUserCreate) => {
    await axios.post<IUserCreate>(`${BACKEND_URL}/auth/register`, data);
};

const signIn = async (data: ISignIn) => {
    await axios.post<ISignIn>(`${BACKEND_URL}/auth/sign-in`, data);
};

const createQuest = async (data: IQuestCreate) => {
    await axios.post<IQuestCreate>(`${BACKEND_URL}/quest`, data);
};

const updateQuest = async (id: string, data: IQuestCreate) => {
    await axios.post<IQuestCreate>(`${BACKEND_URL}/quest/${id}`, data);
};

const updateUser = async (id: string, data: IUserUpdate) => {
    await axios.post<IUserUpdate>(`${BACKEND_URL}/user/${id}`, data);
};

const updatePassword = async (id: string, data: IPasswordUpdate) => {
    await axios.post<IPasswordUpdate>(`${BACKEND_URL}/user/${id}/password`, data);
};

const deleteQuest = async (id: string) => {
    await axios.delete(`${BACKEND_URL}/quest/${id}`);
};

const deleteUser = async (id: string) => {
    await axios.delete(`${BACKEND_URL}/user/${id}`);
};

export {getUserById, getQuestById, authWithGoogle,
    signUp, signIn, createQuest, updateQuest, updateUser,
    updatePassword, deleteQuest, deleteUser};
