'use client'

import { Avatar, Button, Modal } from 'antd';
import React, { useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import ExitButton from '@/components/ExitButton/ExitButton';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import userMock from '@/app/api/__mocks__/User.mock';

import './EditProfile.css';
import { ModalEnum, ModalType } from '@/components/EditProfile/EditProfile.types';
import EditAvatar from '@/components/EditProfile/EditAvatar/EditAvatar';

export default function EditProfile() {
    const { xs } = useBreakpoint();
    const [currentModal, setCurrentModal] = useState<ModalType>(null);

    const showModal = () => {
        console.log(`showModal`)
        setCurrentModal(ModalEnum.EDIT_PROFILE);
    };

    const handleCancel = () => {
        if (currentModal === null) {
            return;
        }

        if (currentModal === ModalEnum.EDIT_PROFILE) {
            console.log(`до handleCancel1`)
            setCurrentModal(null);
            return;
        }

        if (currentModal !== ModalEnum.EDIT_AVATAR) {
            console.log(`до handleCancel3`);
            setCurrentModal(ModalEnum.EDIT_PROFILE);
        }
    };
    return (
        <>
            <Button
                className={'edit-profile__button'}
                size={'middle'}
                icon={<EditOutlined />}
                style={{borderRadius: '2px'}}
                onClick={showModal}
            >
                Редактировать профиль
            </Button>
            <Modal className={'edit-profile__modal'}
                   open={currentModal === ModalEnum.EDIT_PROFILE}
                   destroyOnClose={
                        currentModal !== ModalEnum.EDIT_AVATAR && currentModal !== ModalEnum.EDIT_PROFILE}
                   onCancel={handleCancel}
                   width={xs ? '100%' : 400}
                   footer={<ExitButton block />}
                   style={xs ? { margin: 0, maxWidth: 'unset', } : {}}
            >
                <h1 className={'edit-profile-header roboto-flex-header'}
                    style={xs ? { fontSize: '24px' } : {}}
                >
                    Редактирование<br />профиля
                </h1>
                <div className={'edit-profile__avatar'}>
                    <Avatar
                        className={'avatar__image'}
                        alt={'avatar'}
                        shape={'circle'}
                        src={userMock.avatarUrl}
                        draggable={false}
                        /* на самом деле размер берется (size - 2) */
                        size={130}
                    />
                    <EditAvatar setCurrentModal={setCurrentModal}>
                        <Button className={'edit-profile__change-button'}
                                type={'link'}
                                block
                        >
                            Изменить
                        </Button>
                    </EditAvatar>
                </div>
                <h4 className={'edit-profile-subheader'}>Логин</h4>
                <p className={'edit-profile-paragraph'}>{userMock.username}</p>
                <Button className={'edit-profile__change-button'} type={'link'}>
                    Изменить логин
                </Button>
                <Modal destroyOnClose>
                    Хуй
                </Modal>
                <h4 className={'edit-profile-subheader'}>Пароль</h4>
                <Button className={'edit-profile__change-button'} type={'link'}>
                    Изменить пароль
                </Button>
            </Modal>
        </>
    );
}
