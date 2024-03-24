import { getCenter, ModalEnum, SubModalProps } from '@/components/EditProfile/EditProfile.helpers';
import { Button, Form, Input, Modal } from 'antd';
import React, { useMemo } from 'react';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { updateUser } from '@/app/api/api';
import { useSession } from 'next-auth/react';

import '../EditProfile.css';

export default function EditName({currentModal, setCurrentModal, id, accessToken}: SubModalProps) {
    const {clientWidth, clientHeight} = document.body;
    const centerPosition = useMemo(() => getCenter(clientWidth, clientHeight), [clientWidth, clientHeight]);
    const [form] = Form.useForm();
    const { xs } = useBreakpoint();
    const {update} = useSession();

    const handleSubmit = async () => {
        form.validateFields().catch(err => {throw err});
        const username = form.getFieldValue('username') as string;
        const resp = await updateUser(
            id,
            {username},
            accessToken)
            .catch((error) => {
                throw error;
            });
        await update({name: resp.username}).then(() => setCurrentModal!(ModalEnum.EDIT_PROFILE));
    }

    return (
        <Modal className={'edit-profile__modal edit-name__modal'}
               open={currentModal === ModalEnum.EDIT_NAME}
               destroyOnClose
               onCancel={() => setCurrentModal!(ModalEnum.EDIT_PROFILE)}
               width={xs ? '100%' : 400}
               centered
               title={<h2 className={'edit-profile-header roboto-flex-header responsive-header-h2'}>Изменить
                   логин</h2>}
               mousePosition={centerPosition}
               footer={null}
        >
            <Form form={form} autoComplete={'off'} preserve={false}>
                <Form.Item name={'username'} rules={[{required: true, message: 'Введите новый логин'}]}>
                    <Input type={'text'} style={{borderRadius: '2px'}} required placeholder={'Новый логин'}/>
                </Form.Item>
                <Form.Item >
                    <Button type={'primary'} htmlType={'submit'} block onClick={handleSubmit}>Сохранить</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}
