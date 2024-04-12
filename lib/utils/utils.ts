import React from 'react';

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

export const getCenter = (clientWidth: number, clientHeight: number) => {
    const centerY = clientHeight / 2;
    const centerX = clientWidth / 2;
    return {x: centerX, y: centerY};
}

export type ValidationStatus = '' | 'success' | 'error' | 'warning' | 'validating' | undefined;

export const enum TeamModal {
    CREATE_TEAM,
    INVITE_LINK
}

export type TeamModalType = TeamModal | null;

export interface ModalProps {
    questId?: string,
    inviteLink?: string,
    setCurrentModal?:  React.Dispatch<React.SetStateAction<TeamModalType>>,
    currentModal?: TeamModalType
}
