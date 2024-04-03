'use client';

import { Button, Modal } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { EditOutlined } from '@ant-design/icons';
import ExitButton from '@/components/ExitButton/ExitButton';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { getCenter, ModalEnum, ModalType } from '@/components/EditProfile/EditProfile.helpers';
import EditAvatar from '@/components/EditProfile/EditAvatar/EditAvatar';
import EditName from '@/components/EditProfile/EditName/EditName';
import EditPassword from '@/components/EditProfile/EditPassword/EditPassword';

import './EditProfile.css';

export default function EditProfile() {
    const {clientWidth, clientHeight} = document.body;
    const centerPosition = useMemo(() => getCenter(clientWidth, clientHeight), [clientWidth, clientHeight]);
    const {data: session} = useSession();
    const {name: username, image: avatarUrl} = session!.user;
    const { xs } = useBreakpoint();
    const [currentModal, setCurrentModal] = useState<ModalType>(null);

    useEffect(() => {}, [session]);

    const showModal = () => {
        setCurrentModal(ModalEnum.EDIT_PROFILE);
    };

    const handleCancel = () => {
        if (currentModal === null) {
            return;
        }

        if (currentModal === ModalEnum.EDIT_PROFILE) {
            setCurrentModal(null);
            return;
        }

        if (currentModal !== ModalEnum.EDIT_AVATAR) {
            setCurrentModal(ModalEnum.EDIT_PROFILE);
        }
    };
    return (
        <>
            <Button
                className={'edit-profile__button'}
                size={'middle'}
                style={{borderRadius: '2px'}}
                onClick={showModal}
            >
                <EditOutlined />
                Редактировать профиль
            </Button>
            <Modal className={'edit-profile__modal'}
                   open={currentModal === ModalEnum.EDIT_PROFILE}
                   destroyOnClose={
                        currentModal !== ModalEnum.EDIT_AVATAR && currentModal !== ModalEnum.EDIT_PROFILE}
                   onCancel={handleCancel}
                   width={xs ? '100%' : 400}
                   footer={<ExitButton block />}
                   centered
                   title={<h2 className={'edit-profile-header roboto-flex-header responsive-header-h2'}
                   >
                       Редактирование<br />профиля
                   </h2>}
                   mousePosition={centerPosition}
            >

                <div className={'edit-profile__avatar'}>
                    <Image className={'avatar__image'}
                           src={avatarUrl!}
                           alt={'avatar'}
                           width={128}
                           height={128}
                           draggable={false}
                           style={{borderRadius: '64px'}}
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
                <p className={'edit-profile-paragraph'}>{username}</p>
                <Button className={'edit-profile__change-button'} type={'link'} onClick={() => setCurrentModal(ModalEnum.EDIT_NAME)}>
                    Изменить логин
                </Button>
                <h4 className={'edit-profile-subheader'}>Пароль</h4>
                <Button className={'edit-profile__change-button'} type={'link'} onClick={() => setCurrentModal(ModalEnum.EDIT_PASSWORD)}>
                    Изменить пароль
                </Button>
            </Modal>
            <EditName setCurrentModal={setCurrentModal} currentModal={currentModal}/>
            <EditPassword setCurrentModal={setCurrentModal} currentModal={currentModal}/>
        </>
    );
}
