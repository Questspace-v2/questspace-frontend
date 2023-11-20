'use client';

import { Form, Input, Space } from 'antd';
import Button from 'antd/es/button';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';

export default function LoginForm() {
    return (
        <ContentWrapper className={'page-auth'}>
            <Form>
                <Form.Item name={'input'}>
                    <Input type={'text'} placeholder={'логин'} />
                </Form.Item>
                <Form.Item
                    name={'password'}
                    rules={[
                        {
                            required: true,
                            message: 'не, реально долбоеб',
                        },
                        { min: 6, message: 'ты долбоеб' },
                        {
                            // переписать валидатор, поместив функцию валидации с сервера в api
                            validator: (_, value) =>
                                value?.includes('A')
                                    ? Promise.resolve()
                                    : Promise.reject(
                                          Error(
                                              'Мы вас не узнали. Проверьте правильно ли вы ввели логин и пароль',
                                          ),
                                      ),
                        },
                    ]}
                >
                    <Input type={'password'} placeholder={'пароль'} />
                </Form.Item>
                <Form.Item
                    dependencies={['password']}
                    rules={[
                        {
                            required: true,
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue('password') === value
                                ) {
                                    return Promise.resolve();
                                }

                                return Promise.reject(
                                    Error('Пароли не совпадают'),
                                );
                            },
                        }),
                    ]}
                    hasFeedback
                >
                    <Button htmlType={'submit'}>Войти</Button>
                </Form.Item>
                <Space />
            </Form>
        </ContentWrapper>
    );
}
