'use client'

import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import ExitButton from '@/components/ExitButton/ExitButton';

export default function EditProfile() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
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
            <Modal open={isModalOpen} onCancel={handleCancel} width={400} footer={<ExitButton block/>}>
                <h1 className={'roboto-flex-header'}>Редактирование профиля</h1>
            </Modal>
        </>
    );
}
