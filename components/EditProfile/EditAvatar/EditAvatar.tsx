import React from 'react';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { updateUser } from '@/app/api/api';
import { ModalEnum, ModalType } from '@/components/EditProfile/EditProfile.types';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';

interface SubModalProps {
    children: JSX.Element,
    setCurrentModal:  React.Dispatch<React.SetStateAction<ModalType>>
}

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

export default function EditAvatar({children, setCurrentModal}: SubModalProps) {
    const { xs } = useBreakpoint();
    const handleEditAvatarClose = () => {
        setCurrentModal(ModalEnum.EDIT_PROFILE)
    };

    const beforeCrop = () => {
        setCurrentModal(ModalEnum.EDIT_AVATAR);
    };

    const customRequest = async (file: File) => {
        const fileType = file.type;
        const key = `users/${uid()}`;

        const s3Response = await fetch(`https://storage.yandexcloud.net/questspace-img/users/${key}`, {
            method: 'PUT',
            headers: {
                'Content-Type': fileType,
            },
        })
            .then((response) => response)
            .catch((error) => {
                throw error;
            });

        if (s3Response.ok) {
            await updateUser(
                '855db36b-b217-4db5-baf0-3370fda3e74e',
                {avatar_url: `https://storage.yandexcloud.net/questspace-img/users/${key}`})
                .catch((error) => {
                    throw error;
                });
        }

    }

    return (
        <ImgCrop cropShape={'round'}
                 quality={1}
                 modalWidth={xs ? '100%' : 400}
                 beforeCrop={beforeCrop}
                 onModalCancel={handleEditAvatarClose}
                 modalOk={'Изменить'}
                 modalCancel={'Отмена'}
        >
            <Upload maxCount={1}
                    accept={'image/png,image/jpeg,image/svg+xml'}
                    // @ts-expect-error customRequest не дает засунуть async
                    customRequest={customRequest}
                    headers={{}}
                    style={{width: '130px', textAlign: 'center'}}
                    showUploadList={false}
            >
                {children}
            </Upload>
        </ImgCrop>
    );

}
