'use client';

import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { EditOutlined } from '@ant-design/icons';
import ExitButton from '@/components/ExitButton/ExitButton';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { ModalEnum, ModalType } from '@/components/Profile/EditProfile/EditProfile.helpers';
import EditAvatar from '@/components/Profile/EditProfile/EditAvatar/EditAvatar';
import EditName from '@/components/Profile/EditProfile/EditName/EditName';
import EditPassword from '@/components/Profile/EditProfile/EditPassword/EditPassword';
import CustomModal from '@/components/CustomModal/CustomModal';
import AvatarStub from '../AvatarStub/AvatarStub';


export default function EditProfile() {
    const {data: session} = useSession();
    const {name: username, image: avatarUrl} = session?.user ?? {};
    const isOAuth = session?.isOAuthProvider;
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
            <CustomModal
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

            >

                <div className={'edit-profile__avatar'}>
                    {
                        avatarUrl ?
                        <Image className={'avatar__image'}
                            src={avatarUrl}
                            alt={'avatar'}
                            width={128}
                            height={128}
                            draggable={false}
                            style={{borderRadius: '50%'}}
                        /> :
                        <AvatarStub width={128} height={128} />
                    }
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
                <p className={'edit-profile-paragraph'}>{username ?? 'Аноним'}</p>
                <Button className={'edit-profile__change-button'} type={'link'} onClick={() => setCurrentModal(ModalEnum.EDIT_NAME)}>
                    Изменить логин
                </Button>
                <h4 className={'edit-profile-subheader'} style={isOAuth ? {color: '#8C8C8C'} : {}}>Пароль</h4>
                {isOAuth ?
                    <span style={{color: '#8C8C8C'}}>Учетная запись привязана к аккаунту Google, для авторизации не нужен пароль</span> :
                    <Button className={'edit-profile__change-button'} type={'link'} onClick={() => setCurrentModal(ModalEnum.EDIT_PASSWORD)}>
                        Изменить пароль
                    </Button>
                }
            </CustomModal>
            <EditName setCurrentModal={setCurrentModal} currentModal={currentModal}/>
            <EditPassword setCurrentModal={setCurrentModal} currentModal={currentModal}/>
        </>
    );
}
