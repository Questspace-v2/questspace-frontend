'use client';

import { useState } from 'react';
import { Button, Form, Input } from 'antd';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import {
    Auth,
    AuthFormTypes,
    LoginDictionary,
    SignupDictionary,
    TitleDictionary,
} from '@/components/AuthForm/AuthForm.types';
import FormItem from 'antd/lib/form/FormItem';

import './AuthForm.css';
import { LockOutlined, RightOutlined, UserOutlined } from '@ant-design/icons';
import Logotype from '@/components/Logotype/Logotype';
import { authSignIn, authSignUp } from '@/app/api/api';
import { useFormStatus } from 'react-dom';
import { IUserCreate } from '@/app/types/user-interfaces';
import { signIn, useSession } from 'next-auth/react';

interface AuthFormItems {
    username: string,
    password: string,
    passwordAgain: string,
}

export default function AuthForm() {
    const {pending} = useFormStatus();
    const [formType, setFormType] = useState<AuthFormTypes>(Auth.LOGIN);
    const [dictionary, setDictionary] = useState<TitleDictionary>(LoginDictionary)
    const handleClick = () => {
        setFormType(prevState => prevState === Auth.LOGIN ? Auth.SIGNUP : Auth.LOGIN);
        setDictionary((prevState) => prevState === LoginDictionary ? SignupDictionary : LoginDictionary)
    };

    const onFinish = async (values: AuthFormItems) => {
        const data: IUserCreate = {
            username: values.username,
            password: values.password
        };

        const res = await signIn('credentials', {
            ...data,
            redirect: false
        });

        console.log(res);

        if (formType === Auth.SIGNUP) {
            const result = await authSignUp(data);
            console.log(result);
        } else {
            const result = await authSignIn(data);
            console.log(result);
        }
    };

    const {data: session, status} = useSession();
    console.log(session, status);

    return (
        <section className={'page-auth'}>
            <ContentWrapper className={'page-auth__wrapper'}>
                <div className={'auth-form__header'}>
                    <Logotype width={64} type={'icon'}/>
                    <h1 className={'auth-form__title roboto-flex-header'}>{dictionary.pageHeader}</h1>
                </div>

                <Form
                    name={'auth-form'}
                    className={'auth-form__body'}
                    title={dictionary.formTitle}
                    style={{ width: '100%' }}
                    initialValues={{ remember: true }}
                    /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
                    onFinish={onFinish}
                >
                    <FormItem<AuthFormItems> name={'username'} required>
                        <Input
                            prefix={<UserOutlined />}
                            size={'middle'}
                            variant={'outlined'}
                            placeholder={'логин'}
                        />
                    </FormItem>
                    <FormItem name={'password'}>
                        <Input
                            type={'password'}
                            prefix={<LockOutlined />}
                            size={'middle'}
                            variant={'outlined'}
                            placeholder={'пароль'}
                        />
                    </FormItem>
                    {formType === Auth.SIGNUP &&
                    <FormItem<AuthFormItems>
                        name={'passwordAgain'}
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The new password that you entered do not match!'));
                                    },
                                })
                        ]}
                    >
                        <Input
                            type={'password'}
                            prefix={<LockOutlined />}
                            size={'middle'}
                            variant={'outlined'}
                            placeholder={'снова пароль'}
                        />
                    </FormItem>
                    }
                    <FormItem className={'auth-form__submit-button'}>
                        <Button type="primary" htmlType="submit" disabled={pending} block style={{
                            borderRadius: '2px',
                            fontWeight: 500,
                        }}>
                            {dictionary.submitButton}
                        </Button>
                    </FormItem>
                </Form>
            </ContentWrapper>
            <Button className={'page-auth__change-button'} shape={'round'} onClick={handleClick} block style={{
                border: 'none',
                boxShadow: 'unset',
                fontWeight: 500,
                padding: '6.4px 15px',
                height: 'unset',
            }}>
                {dictionary.changeFormButton}
                <RightOutlined style={{marginInlineStart: '4px'}}/>
            </Button>
    </section>
    );
}
