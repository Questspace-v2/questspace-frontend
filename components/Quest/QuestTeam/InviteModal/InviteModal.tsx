'use client'

import React from 'react';
import { Input, message } from 'antd';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { CopyOutlined } from '@ant-design/icons';
import {ModalProps, TeamModal} from '@/lib/utils/modalTypes';
import CustomModal, { customModalClassname } from '@/components/CustomModal/CustomModal';
import classNames from 'classnames';

export default function InviteModal({inviteLink, currentModal, setCurrentModal, registrationType = 'AUTO'}: ModalProps) {
    const { xs } = useBreakpoint();
    const [messageApi, contextHolder] = message.useMessage();

    const onCancel = () => {
        setCurrentModal!(null);
    };

    const success = () => {
        // eslint-disable-next-line no-void
        void messageApi.open({
            type: 'success',
            content: 'Скопировано!',
        });
    };

    if (registrationType === 'AUTO') {
        return (
            <CustomModal
                classNames={{content: 'invite-modal__content'}}
                open={currentModal === TeamModal.INVITE_LINK}
                centered
                destroyOnClose
                onCancel={onCancel}
                width={xs ? '100%' : 400}
                title={
                    <h2 className={classNames(
                        `${customModalClassname}-header-large`,
                        `${customModalClassname}-header_success`,
                        'roboto-flex-header'
                    )}>
                        Команда зарегистрирована
                    </h2>
                }
                footer={null}
            >
                <span className={'invite-content__span'}>Пригласите друзей в свою команду</span>
                {contextHolder}
                <Input
                    type={'text'}
                    style={{ borderRadius: '2px' }}
                    defaultValue={inviteLink}
                    readOnly
                    suffix={<CopyOutlined onClick={() => {
                        navigator.clipboard.writeText(inviteLink!).then(() => success()).catch(err => {throw err});
                    }}/>}
                />
            </CustomModal>
        );
    }

    return (
        <CustomModal
            classNames={{ content: 'invite-modal__content' }}
            open={currentModal === TeamModal.INVITE_LINK}
            centered
            destroyOnClose
            onCancel={onCancel}
            width={xs ? '100%' : 400}
            title={<h2 className={classNames(`${customModalClassname}-header-large`, 'roboto-flex-header')}>Заявка
                отправлена</h2>}
            footer={null}
        >
            <span className={'invite-content__span'}>Отследить статус заявки можно на странице квеста в разделе твоя команда</span>
            <span className={'invite-content__span'}>А пока можно пригласить друзей в свою команду:</span>
            {contextHolder}
            <Input
                type={'text'}
                style={{ borderRadius: '2px' }}
                defaultValue={inviteLink}
                readOnly
                suffix={<CopyOutlined onClick={() => {
                    navigator.clipboard.writeText(inviteLink!).then(() => success()).catch(err => {
                        throw err
                    });
                }} />}
            />
        </CustomModal>
    );
}
