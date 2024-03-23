import React from 'react';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { updateUser } from '@/app/api/api';
import { ModalEnum, ModalType } from '@/components/EditProfile/EditProfile.types';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import client from '@/app/api/client/client';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { useSession } from 'next-auth/react';

interface SubModalProps {
    children: JSX.Element,
    setCurrentModal:  React.Dispatch<React.SetStateAction<ModalType>>,
    id: string,
    accessToken: string
}

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

export default function EditAvatar({children, setCurrentModal, id, accessToken}: SubModalProps) {
    const {update} = useSession();
    const { xs } = useBreakpoint();
    const handleEditAvatarClose = () => {
        setCurrentModal(ModalEnum.EDIT_PROFILE)
    };

    const beforeCrop = () => {
        setCurrentModal(ModalEnum.EDIT_AVATAR);
    };

    const customRequest = async ({file}: UploadRequestOption) => {
        const fileType = (file as File).type;
        const key = `users/${uid()}`;

        const s3Response = await client.handleS3Request(key, fileType, file);

        if (s3Response.ok) {
            const resp = await updateUser(
                id,
                {avatar_url: `https://storage.yandexcloud.net/questspace-img/${key}`},
                accessToken)
                .catch((error) => {
                    throw error;
                });
            await update({name: resp.username, image: resp.avatar_url});
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
