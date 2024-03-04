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

export default function AuthForm() {
    const [formType, setFormType] = useState<AuthFormTypes>(Auth.LOGIN);
    const [dictionary, setDictionary] = useState<TitleDictionary>(LoginDictionary)
    const handleClick = () => {
        setFormType(prevState => prevState === Auth.LOGIN ? Auth.SIGNUP : Auth.LOGIN);
        setDictionary((prevState) => prevState === LoginDictionary ? SignupDictionary : LoginDictionary)
    };

    return (
        <section className={'page-auth'}>
            <ContentWrapper className={'page-auth__wrapper'}>
                <div className={'auth-form__header'}>
                    <Logotype width={64} type={'icon'}/>
                    <h1 className={'auth-form__title roboto-flex-header'}>{dictionary.pageHeader}</h1>
                </div>

                <Form
                    className={'auth-form__body'}
                    title={dictionary.formTitle}
                    style={{ width: '100%' }}
                    method={'post'}
                >
                    <FormItem name={'login'}>
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
                    <FormItem
                        name={'password-again'}
                        hidden={formType === Auth.LOGIN}
                    >
                        <Input
                            type={'password'}
                            prefix={<LockOutlined />}
                            size={'middle'}
                            variant={'outlined'}
                            placeholder={'снова пароль'}
                        />
                    </FormItem>
                    <FormItem className={'auth-form__submit-button'}>
                        <Button type="primary" htmlType="submit" block style={{
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
