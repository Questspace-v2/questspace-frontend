import { Session } from 'next-auth';
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
    session?: Session | null,
}
