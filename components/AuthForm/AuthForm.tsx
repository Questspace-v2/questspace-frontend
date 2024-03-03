'use client';

import { useState } from 'react';
import { Button, Form, Input } from 'antd';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { Auth, AuthFormTypes } from '@/components/AuthForm/AuthForm.types';
import FormItem from 'antd/lib/form/FormItem';

import './AuthForm.css';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import Logotype from '@/components/Logotype/Logotype';

export default function AuthForm() {
    const [isSignupForm, setIsSignupForm] = useState(false);
    const [formType, setFormType] = useState<AuthFormTypes>(Auth.LOGIN);
    const handleClick = () => {
        setIsSignupForm(!isSignupForm);
        setFormType(formType === Auth.LOGIN ? Auth.SIGNUP : Auth.LOGIN);
    };

    return (
        <ContentWrapper className={'page-auth__wrapper'}>
            <div className={'auth-form__header'}>
                <Logotype width={64} type={'icon'}/>
                <h1 className={'auth-form__title'}>{isSignupForm ? 'Регистрация' : 'Вход в\u00A0Квестспейс'}</h1>
            </div>

            <Form
                className={'auth-form__body'}
                title={formType === Auth.LOGIN ? 'Вход' : 'Регистрация'}
                style={{ width: '100%' }}
                method={'post'}
            >
                <FormItem name={'login'}>
                    <Input
                        prefix={<UserOutlined />}
                        size={'small'}
                        variant={'outlined'}
                        placeholder={'логин'}
                    />
                </FormItem>
                <FormItem name={'password'}>
                    <Input
                        type={'password'}
                        prefix={<LockOutlined />}
                        size={'small'}
                        variant={'outlined'}
                        placeholder={'пароль'}
                    />
                </FormItem>
                <FormItem
                    name={'password-again'}
                    // className={`signup-form ${
                    //     formType === Auth.LOGIN ? 'hidden' : 'showed'
                    // }`}
                    hidden={formType === Auth.LOGIN}
                    // className={'password-again'}
                >
                    <Input
                        type={'password'}
                        prefix={<LockOutlined />}
                        size={'small'}
                        variant={'outlined'}
                        placeholder={'снова пароль'}
                    />
                </FormItem>
                <Button onClick={handleClick} />
            </Form>
        </ContentWrapper>
    );
}
