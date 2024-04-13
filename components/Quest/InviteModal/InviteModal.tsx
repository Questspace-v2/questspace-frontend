'use client'

import React, { useMemo } from 'react';
import { getCenter, ModalProps, TeamModal } from '@/lib/utils/utils';
import { Input, Modal } from 'antd';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { CopyOutlined } from '@ant-design/icons';

export default function InviteModal({inviteLink, currentModal, setCurrentModal}: ModalProps) {
    const {clientWidth, clientHeight} = document.body;
    const centerPosition = useMemo(() => getCenter(clientWidth, clientHeight), [clientWidth, clientHeight]);
    const { xs } = useBreakpoint();

    const onCancel = () => {
        setCurrentModal!(null);
    };

    return (
        <Modal
            className={'invite-modal'}
            classNames={{content: 'invite-modal__content'}}
            open={currentModal === TeamModal.INVITE_LINK}
            centered
            destroyOnClose
            onCancel={onCancel}
            width={xs ? '100%' : 400}
            title={<h2 className={'roboto-flex-header responsive-header-h2'} style={{color: 'var(--green-color)'}}>Команда зарегистрирована</h2>}
            mousePosition={centerPosition}
            footer={null}
        >
            <span>Пригласите друзей в свою команду</span>
            <Input
                type={'text'}
                style={{ borderRadius: '2px' }}
                defaultValue={inviteLink}
                readOnly
                suffix={<CopyOutlined />}
            />
        </Modal>
    );
}
