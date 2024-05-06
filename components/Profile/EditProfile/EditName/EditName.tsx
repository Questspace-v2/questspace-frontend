import { ModalEnum, SubModalProps } from '@/components/Profile/EditProfile/EditProfile.helpers';
import { Button, Form, Input, Modal } from 'antd';
import React, { useMemo, useState } from 'react';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { updateUser } from '@/app/api/api';
import { useSession } from 'next-auth/react';

import '../EditProfile.css';
import { IUserUpdateResponse } from '@/app/types/user-interfaces';
import { getCenter } from '@/lib/utils/utils';
import {ValidationStatus} from '@/lib/utils/modalTypes';

export default function EditName({currentModal, setCurrentModal}: SubModalProps) {
    const {clientWidth, clientHeight} = document.body;
    const centerPosition = useMemo(() => getCenter(clientWidth, clientHeight), [clientWidth, clientHeight]);
    const [form] = Form.useForm();
    const { xs } = useBreakpoint();
    const {data, update} = useSession();
    const {id} = data!.user;
    const {accessToken} = data!;

    const [errorMsg, setErrorMsg] = useState('');
    const [validationStatus, setValidationStatus] = useState<ValidationStatus>('success');

    const handleError = (msg = 'Логин уже занят') => {
        setValidationStatus('error');
        setErrorMsg(msg);
    };

    const handleSubmit = async () => {
        form.validateFields().catch(err => {throw err});
        const username = form.getFieldValue('username') as string;
        if (!username) {
            handleError('Логин не может быть пустым');
            return;
        }
        const resp = await updateUser(id, { username }, accessToken)
            .then(response => response as IUserUpdateResponse)
            .catch((error) => {
                throw error;
            });
        if (resp) {
            await update({name: resp.user.username, accessToken: resp.access_token}).then(() => setCurrentModal!(ModalEnum.EDIT_PROFILE));
        } else {
            handleError();
        }
    };

    const onCancel = () => {
        setValidationStatus('success');
        setErrorMsg('');
        setCurrentModal!(ModalEnum.EDIT_PROFILE);
    };

    const handleFieldChange = () => {
        setValidationStatus('success');
        setErrorMsg('');
    };

    return (
        <Modal className={'edit-profile__modal edit-name__modal'}
               open={currentModal === ModalEnum.EDIT_NAME}
               destroyOnClose
               onCancel={onCancel}
               width={xs ? '100%' : 400}
               centered
               title={<h2 className={'edit-profile-header roboto-flex-header responsive-header-h2'}>Изменить
                   логин</h2>}
               mousePosition={centerPosition}
               footer={null}
        >
            <Form form={form} autoComplete={'off'} preserve={false}>
                <Form.Item name={'username'}
                           rules={[{required: true, message: 'Введите новый логин'}]}
                           validateStatus={validationStatus}
                           help={errorMsg}>
                    <Input type={'text'}
                           style={{borderRadius: '2px'}}
                           placeholder={'Новый логин'}
                           onChange={handleFieldChange}/>
                </Form.Item>
                <Form.Item >
                    <Button type={'primary'} htmlType={'submit'} block onClick={handleSubmit}>Сохранить</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}
