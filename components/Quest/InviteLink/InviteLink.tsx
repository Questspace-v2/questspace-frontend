'use client'

import React, { useMemo, useState } from 'react';
import { getCenter, TeamModal, TeamModalType } from '@/lib/utils/utils';
import { Form, Input, Modal } from 'antd';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import FormItem from 'antd/lib/form/FormItem';
import { CopyOutlined } from '@ant-design/icons';

export default function InviteLink({inviteLink}: {inviteLink: string | undefined}) {
    const {clientWidth, clientHeight} = document.body;
    const centerPosition = useMemo(() => getCenter(clientWidth, clientHeight), [clientWidth, clientHeight]);
    const [form] = Form.useForm();
    const { xs } = useBreakpoint();
    const [currentModal, setCurrentModal] = useState<TeamModalType>(null);

    const onCancel = () => {
        setCurrentModal(null);
    };

    return (
        <Modal
            open={currentModal === TeamModal.CREATE_TEAM}
            centered
            destroyOnClose
            onCancel={onCancel}
            width={xs ? '100%' : 400}
            title={<h2>Команда зарегистрирована</h2>}
            mousePosition={centerPosition}
            footer={null}
        >
            <Form form={form} autoComplete={'off'} preserve={false}>
                <p>Пригласите друзей в свою команду</p>
                <FormItem
                    name={'inviteLink'}
                >
                    <Input
                        type={'text'}
                        style={{ borderRadius: '2px' }}
                        value={inviteLink}
                        readOnly
                    ><CopyOutlined style={{marginInlineStart: '3px'}}/></Input>
                </FormItem>
            </Form>
        </Modal>
    );
}