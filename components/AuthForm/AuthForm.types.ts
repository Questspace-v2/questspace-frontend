export enum Auth {
    LOGIN = 'login',
    SIGNUP = 'sign-up',
}

export type AuthFormTypes = Auth.LOGIN | Auth.SIGNUP;
export interface TitleDictionary {
    pageHeader: string;
    formTitle: string;
    submitButton: string;
    changeFormButton: string;
}
export const LoginDictionary : TitleDictionary = {
    pageHeader: 'Вход в\u00A0Квестспейс',
    formTitle: 'Вход',
    submitButton: 'Войти',
    changeFormButton: 'Зарегистрироваться'
}

export const SignupDictionary : TitleDictionary = {
    pageHeader: 'Регистрация',
    formTitle: 'Регистрация',
    submitButton: 'Зарегистрироваться',
    changeFormButton: 'У меня уже есть учетная запись'
}
