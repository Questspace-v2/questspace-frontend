import React, { useMemo } from 'react';
import { message, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { updateUser } from '@/app/api/api';
import { getCenter, ModalEnum, SubModalProps } from '@/components/EditProfile/EditProfile.helpers';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import client from '@/app/api/client/client';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { useSession } from 'next-auth/react';
import { RcFile } from 'antd/es/upload';
import { uid } from '@/lib/utils/utils';

export default function EditAvatar({children, setCurrentModal, id, accessToken}: SubModalProps) {
    const [messageApi, contextHolder] = message.useMessage();
    const {clientWidth, clientHeight} = document.body;
    const centerPosition = useMemo(() => getCenter(clientWidth, clientHeight), [clientWidth, clientHeight]);

    const error = () => {
        // eslint-disable-next-line no-void
        void messageApi.open({
            type: 'error',
            content: 'Неправильный формат',
        });
    };

    const {update} = useSession();
    const { xs } = useBreakpoint();
    const handleEditAvatarClose = () => {
        setCurrentModal!(ModalEnum.EDIT_PROFILE)
    };

    const beforeCrop = (file: RcFile) => {
        const fileType = (file as File).type;
        if (!fileType.startsWith('image/')) {
            error();
            throw new Error('Неправильный формат');
        }

        setCurrentModal!(ModalEnum.EDIT_AVATAR);
    };

    const customRequest = async ({file}: UploadRequestOption) => {
        const fileType = (file as File).type;
        if (!fileType.startsWith('image/')) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const key = `users/${uid()}`;

        const s3Response = await client.handleS3Request(key, fileType, file);

        if (s3Response.ok) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const resp = await updateUser(
                id,
                {avatar_url: `https://storage.yandexcloud.net/questspace-img/${key}`},
                accessToken)
                .catch((err) => {
                    throw err;
                });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
            await update({image: resp.avatar_url});
        }

    }

    return (
        <>
            {contextHolder}
            <ImgCrop cropShape={'round'}
                     quality={1}
                     modalWidth={xs ? '100%' : 400}
                     beforeCrop={beforeCrop}
                     onModalCancel={handleEditAvatarClose}
                     modalOk={'Изменить'}
                     modalCancel={'Отмена'}
                     modalProps={{centered: true, mousePosition: centerPosition}}
            >
                <Upload maxCount={1}
                        accept={'image/*'}
                        customRequest={customRequest}
                        headers={{}}
                        style={{width: '130px', textAlign: 'center'}}
                        showUploadList={false}
                >
                    {children}
                </Upload>
            </ImgCrop>
        </>
    );

}
