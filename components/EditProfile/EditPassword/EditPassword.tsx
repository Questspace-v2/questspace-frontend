/* eslint-disable @typescript-eslint/no-unused-vars */

import { getCenter, ModalEnum, SubModalProps } from '@/components/EditProfile/EditProfile.helpers';
import { Button, Form, Input, Modal } from 'antd';
import React, { useMemo, useState } from 'react';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { updatePassword } from '@/app/api/api';

import '../EditProfile.css';
import { IUser } from '@/app/types/user-interfaces';
import { ValidationStatus } from '@/components/AuthForm/AuthForm.types';

export default function EditPassword({currentModal, setCurrentModal, id, accessToken}: SubModalProps) {
    const {clientWidth, clientHeight} = document.body;
    const centerPosition = useMemo(() => getCenter(clientWidth, clientHeight), [clientWidth, clientHeight]);
    const [form] = Form.useForm();
    const { xs } = useBreakpoint();

    const [errorMsg, setErrorMsg] = useState('');
    const [validationStatus, setValidationStatus] = useState<ValidationStatus>('success');

    const handleError = (msg = 'Проверьте, правильно ли введен старый пароль') => {
        setErrorMsg(msg);
        setValidationStatus('error');
    };

    const handleSubmit = async () => {
        form.validateFields().catch(err => {throw err});
        const oldPassword = form.getFieldValue('oldPassword') as string;
        const newPassword = form.getFieldValue('password') as string;
        const resp = await updatePassword(
            id,
            {old_password: oldPassword, new_password: newPassword},
            accessToken)
            .then(response => response as IUser)
            .catch((error) => {
                handleError();
                throw error;
            });
        if (resp) {
            setCurrentModal!(ModalEnum.EDIT_PROFILE);
        } else {
            handleError();
        }
    }

    return (
        <Modal className={'edit-profile__modal edit-password__modal'}
               open={currentModal === ModalEnum.EDIT_PASSWORD}
               destroyOnClose
               onCancel={() => setCurrentModal!(ModalEnum.EDIT_PROFILE)}
               width={xs ? '100%' : 400}
               centered
               title={<h2 className={'edit-profile-header roboto-flex-header responsive-header-h2'}>Изменить пароль</h2>}
               mousePosition={centerPosition}
               footer={null}
        >
            <Form form={form} autoComplete={'off'} preserve={false}>
                <Form.Item name={'oldPassword'} rules={[{required: true, message: 'Введите старый пароль'}]}>
                    <Input type={'password'} style={{borderRadius: '2px'}} required placeholder={'Старый пароль'}/>
                </Form.Item>
                <Form.Item name={'password'} rules={[{required: true, message: 'Введите новый пароль'}]}>
                    <Input type={'password'} style={{borderRadius: '2px'}} required placeholder={'Новый пароль'}/>
                </Form.Item>
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
                    <Input type={'password'} style={{borderRadius: '2px'}} placeholder={'Повторите новый пароль'} />
                </Form.Item>
                <Form.Item >
                    <Button type={'primary'} htmlType={'submit'} block onClick={handleSubmit}>Сохранить</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}
