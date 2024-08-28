import React, { useMemo } from 'react';
import { message, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { ModalEnum, SubModalProps } from '@/components/Profile/EditProfile/EditProfile.helpers';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import client from '@/app/api/client/client';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { useSession } from 'next-auth/react';
import { RcFile } from 'antd/es/upload';
import { getCenter, uid } from '@/lib/utils/utils';
import UserService from "@/app/api/services/userService";

export default function EditAvatar({children, setCurrentModal}: SubModalProps) {
    const [messageApi, contextHolder] = message.useMessage();
    const {clientWidth, clientHeight} = document.body;
    const centerPosition = useMemo(() => getCenter(clientWidth, clientHeight), [clientWidth, clientHeight]);
    const {data, update} = useSession();
    const {id} = data!.user;
    const {accessToken} = data!;
    const { xs } = useBreakpoint();

    const userService = new UserService();

    const error = () => {
        // eslint-disable-next-line no-void
        void messageApi.open({
            type: 'error',
            content: 'Неправильный формат',
        });
    };

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

        const key = `users/${uid()}`;
        const s3Response = await client.handleS3Request(key, fileType, file);

        if (s3Response.ok) {
            const resp = await userService
                .updateUserData(
                    id,
                    { avatar_url: `https://storage.yandexcloud.net/questspace-img/${key}` },
                    accessToken
                ).catch((err) => {
                    throw err;
                });
            await update({image: resp.user.avatar_url, accessToken: resp.access_token});
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
