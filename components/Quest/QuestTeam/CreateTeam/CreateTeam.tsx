'use client';

import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { createTeam } from '@/app/api/api';
import { ITeam } from '@/app/types/user-interfaces';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import {ModalProps, TeamModal, ValidationStatus} from '@/lib/utils/modalTypes';
import CustomModal, { customModalClassname } from '@/components/CustomModal/CustomModal';
import classNames from 'classnames';

export default function CreateTeam({questId, currentModal, setCurrentModal, registrationType = 'AUTO'}: ModalProps) {
    const [form] = Form.useForm();
    const { xs } = useBreakpoint();
    const {data} = useSession();
    const accessToken = data?.accessToken;
    const router = useRouter();

    const [errorMsg, setErrorMsg] = useState('');
    const [validationStatus, setValidationStatus] = useState<ValidationStatus>('success');

    const handleError = (msg: string) => {
        setValidationStatus('error');
        setErrorMsg(msg);
    };

    const handleFieldChange = () => {
        setValidationStatus('success');
        setErrorMsg('');
    };

    const handleSubmit = async () => {
        const teamName = form.getFieldValue('teamName') as string;
        if (!teamName) {
            handleError('Это поле не должно быть пустым');
            return;
        }
        const redirectParams = new URLSearchParams({route: 'quest', id: questId!});
        if (!accessToken) {
            router.push(`/auth?${redirectParams.toString()}`);
            return;
        }
        const resp = await createTeam(questId!, {name: teamName}, accessToken)
            .then(response => response as ITeam)
            .then(team => team)
            .catch(err => {
                handleError('Упс, что-то пошло не так...');
                throw err;
            });
        if (resp) {
            router.refresh();
            setCurrentModal!(TeamModal.INVITE_LINK);
        }
    };

    const onCancel = () => {
        setValidationStatus('success');
        setErrorMsg('');
        setCurrentModal!(null);
    };

    if (registrationType === 'AUTO') {
        return (
            <CustomModal
                classNames={{content: 'create-team-modal__content'}}
                open={currentModal === TeamModal.CREATE_TEAM}
                centered
                destroyOnClose
                onCancel={onCancel}
                width={xs ? '100%' : 400}
                title={<h2 className={classNames(`${customModalClassname}-header-large`, 'roboto-flex-header')}>Регистрация команды</h2>}
                footer={null}
            >
                <span className={'create-team-content__span'}>Укажите название команды</span>
                <Form form={form} autoComplete={'off'} preserve={false}>
                    <FormItem
                        help={errorMsg}
                        name={'teamName'}
                        rules={[{required: true, message: 'Укажите название команды'}]}
                        validateStatus={validationStatus}>
                        <Input
                            type={'text'}
                            placeholder={'Команда А'}
                            style={{borderRadius: '2px'}}
                            onChange={handleFieldChange}/>
                    </FormItem>
                    <FormItem>
                        <Button
                            type={'primary'}
                            htmlType={'submit'}
                            block
                            onClick={handleSubmit}
                        >Зарегистрировать команду</Button>
                    </FormItem>
                </Form>
            </CustomModal>
        );
    }

    return (
        <CustomModal
            classNames={{ content: 'create-team-modal__content' }}
            open={currentModal === TeamModal.CREATE_TEAM}
            centered
            destroyOnClose
            onCancel={onCancel}
            width={xs ? '100%' : 400}
            title={<h2 className={classNames(`${customModalClassname}-header-large`, 'roboto-flex-header')}>Подать заявку на&nbsp;участие</h2>}
            footer={null}
        >
            <span className={'create-team-content__span'}>
                Для участия в квесте нужно подать заявку от команды.
                Далее заявку рассмотрят организаторы.
            </span>
            <br/>
            <span className={'create-team-content__span'}>Укажите название команды</span>
            <Form form={form} autoComplete={'off'} preserve={false}>
                <FormItem
                    help={errorMsg}
                    name={'teamName'}
                    rules={[{ required: true, message: 'Укажите название команды' }]}
                    validateStatus={validationStatus}>
                    <Input
                        type={'text'}
                        placeholder={'Команда А'}
                        style={{ borderRadius: '2px' }}
                        onChange={handleFieldChange} />
                </FormItem>
                <FormItem>
                    <Button
                        type={'primary'}
                        htmlType={'submit'}
                        block
                        onClick={handleSubmit}
                    >Зарегистрировать команду</Button>
                </FormItem>
            </Form>
        </CustomModal>
    );
}
