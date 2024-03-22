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
import { FRONTEND_URL } from '@/app/api/client/constants';
import { useFormStatus } from 'react-dom';
import { signIn, SignInAuthorizationParams, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface AuthFormItems {
    username: string,
    password: string,
    passwordAgain: string,
}

export default function AuthForm() {
    const [form] = Form.useForm<AuthFormItems>();
    const {pending} = useFormStatus();
    const [formType, setFormType] = useState<AuthFormTypes>(Auth.LOGIN);
    const [dictionary, setDictionary] = useState<TitleDictionary>(LoginDictionary)
    const handleChangeClick = () => {
        setFormType(prevState => prevState === Auth.LOGIN ? Auth.SIGNUP : Auth.LOGIN);
        setDictionary((prevState) => prevState === LoginDictionary ? SignupDictionary : LoginDictionary)
    };

    const onFinish = async (values: AuthFormItems) => {
        const data: SignInAuthorizationParams = {
            username: values.username,
            password: values.password
        };

        if (formType === Auth.SIGNUP) {
            console.log('Ugh');
        } else {
            await signIn('sign-in', {
                callbackUrl: FRONTEND_URL,
                redirect: false,
                ...data
            });
        }
    };

    const session = useSession();
    console.log(session);

    return (
        <section className={'page-auth'}>
            <ContentWrapper className={'page-auth__content-wrapper'}>
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
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.Item<AuthFormItems>
                        name={'username'} required>
                        <Input
                            prefix={<UserOutlined />}
                            size={'middle'}
                            variant={'outlined'}
                            placeholder={'логин'}
                            autoComplete={'username'}
                        />
                    </Form.Item>
                    <Form.Item<AuthFormItems> name={'password'} rules={[{required: true}]}>
                        <Input
                            type={'password'}
                            prefix={<LockOutlined />}
                            size={'middle'}
                            variant={'outlined'}
                            placeholder={'пароль'}
                            autoComplete={formType === Auth.SIGNUP ? 'new-password' : 'current-password'}
                        />
                    </Form.Item>
                    {formType === Auth.SIGNUP &&
                    <Form.Item
                        name={'passwordAgain'}
                        dependencies={['password']}
                        rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const pswValue = getFieldValue('password') as string;
                                        if ((!value && !pswValue)|| pswValue === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Пароли не совпадают'));
                                    },
                                })
                        ]}
                    >
                        <Input
                            type={'password'}
                            prefix={<LockOutlined />}
                            size={'middle'}
                            variant={'outlined'}
                            placeholder={'повтори пароль'}
                            autoComplete={'new-password'}
                        />
                    </Form.Item>
                    }
                    <FormItem className={'auth-form__submit-button'}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={pending}
                            block
                            style={{ borderRadius: '2px', fontWeight: 500, }}
                        >
                            {dictionary.submitButton}
                        </Button>
                    </FormItem>
                </Form>
            </ContentWrapper>
            <Button className={'page-auth__change-button'} shape={'round'} onClick={handleChangeClick} block style={{
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
