import React from 'react';

export const enum ModalEnum {
    EDIT_PROFILE,
    EDIT_AVATAR,
    EDIT_NAME,
    EDIT_PASSWORD
}

export type ModalType = ModalEnum | null;

export interface SubModalProps {
    children?: JSX.Element,
    setCurrentModal?:  React.Dispatch<React.SetStateAction<ModalType>>,
    currentModal?: ModalType,
    id: string,
    accessToken: string
}

export const getCenter = (clientWidth: number, clientHeight: number) => {
    const centerY = clientHeight / 2;
    const centerX = clientWidth / 2;
    return {x: centerX, y: centerY};
}
