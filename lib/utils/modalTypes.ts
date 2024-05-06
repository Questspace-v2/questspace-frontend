import React from 'react';

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