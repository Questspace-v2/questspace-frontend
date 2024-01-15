'use client';

import { useState } from 'react';
import { Button, Form, Input } from 'antd';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { Auth, AuthFormTypes } from '@/components/AuthForm/AuthForm.types';
import FormItem from 'antd/lib/form/FormItem';

import './AuthForm.css';
import { UserOutlined } from '@ant-design/icons';

export default function AuthForm() {
    const [isSignupForm, setIsSignupForm] = useState(false);
    const [formType, setFormType] = useState<AuthFormTypes>(Auth.LOGIN);
    const handleClick = () => {
        setIsSignupForm(!isSignupForm);
        setFormType(formType === Auth.LOGIN ? Auth.SIGNUP : Auth.LOGIN);
    };

    return (
        <ContentWrapper className={'page-auth__wrapper'}>
            <Form
                title={formType === Auth.LOGIN ? 'Вход' : 'Регистрация'}
                style={{ width: '100%' }}
            >
                <FormItem name={'login'}>
                    <Input
                        prefix={<UserOutlined />}
                        size={'small'}
                        bordered
                        placeholder={'логин'}
                    />
                </FormItem>
                <FormItem
                    name={'password-again'}
                    className={`signup-form ${
                        formType === Auth.LOGIN ? 'hidden' : 'showed'
                    }`}
                    // hidden={formType === Auth.LOGIN}
                    // className={'password-again'}
                >
                    <Input
                        size={'small'}
                        bordered
                        placeholder={'снова пароль'}
                    />
                </FormItem>
                <Button onClick={handleClick} />
            </Form>
        </ContentWrapper>
    );
}
