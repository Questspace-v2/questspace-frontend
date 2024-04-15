import { Button } from 'antd';
import { CheckOutlined, FlagFilled, PlayCircleFilled } from '@ant-design/icons';
import { ITeam, IUser } from '@/app/types/user-interfaces';

import '@/components/QuestTabs/QuestCard/QuestCard.css';
import React, { Dispatch, SetStateAction } from 'react';
import { TeamModal, TeamModalType } from '@/lib/utils/utils';

export interface QuestHeaderProps {
    access: string,
    id: string,
    creator: IUser,
    start_time: string | Date,
    finish_time: string | Date,
    media_link: string,
    name: string,
    registration_deadline: string | Date,
    status: string
}

export const enum QuestStatus {
    StatusUnspecified = '',
    StatusOnRegistration = 'ON_REGISTRATION',
    StatusRegistrationDone = 'REGISTRATION_DONE',
    StatusRunning = 'RUNNING',
    StatusWaitResults = 'WAIT_RESULTS',
    StatusFinished = 'FINISHED',
}

function declOfNum(number: number, titles: string[]) {
    const cases: number[] = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

export function getTimeDiff(startDate: Date, finishDate: Date) {
    const hours = Math.abs(startDate.getTime() - finishDate.getTime()) / 36e5;
    if (hours < 1) {
        const minutes = Math.abs(startDate.getTime() - finishDate.getTime()) / 6e4;
        return `${Math.floor(minutes)}\u00A0${declOfNum(minutes, ['минута', 'минуты', 'минут'])}`;
    }
    if (hours >= 24) {
        const days = Math.floor(hours / 24);
        return `${days}\u00A0${declOfNum(days, ['день', 'дня', 'дней'])}`;
    }
    return `${Math.floor(hours)}\u00A0${declOfNum(Math.floor(hours), ['час', 'часа', 'часов'])}`;
}

const getStartDateText = (startDate: Date) => {
    const startDayMonth = startDate.toLocaleString('ru', {day: 'numeric', month: 'long'});
    const startHourMinute = startDate.toLocaleString('ru', {hour: 'numeric', minute: '2-digit'});

    return `${startDayMonth} в ${startHourMinute}`;
}

const getQuestStatusButton = (startDate: Date, registrationDate: Date,
                              finishDate: Date, status: string, currentModal: TeamModalType,
                              setCurrentModal: Dispatch<SetStateAction<TeamModalType>>, id: string, team?: ITeam) => {
    const statusQuest = status as QuestStatus;

    if (statusQuest === QuestStatus.StatusOnRegistration) {
        if (team) {
            const startDateDayMonth = startDate.toLocaleString('ru', {day: 'numeric', month: 'long'}).replace(' ', '\u00A0');
            const startDateHourMinute = startDate.toLocaleString('ru', {hour: 'numeric', minute: '2-digit'});

            return (
                <div className={'quest-header__interactive'}>
                    <Button className={'already-have-team'} size={'large'} type={'dashed'} disabled ghost block>
                        <CheckOutlined/>
                        Ты уже в команде
                    </Button>
                    <p>{`Старт квеста ${startDateDayMonth} в\u00A0${startDateHourMinute}`}</p>
                </div>
            );
        }

        const registrationDayMonth = registrationDate.toLocaleString('ru', {
            day: 'numeric',
            month: 'long',
        }).replace(' ', '\u00A0');
        const registrationHourMinute = registrationDate.toLocaleString('ru', {
            hour: 'numeric', minute: '2-digit'
        });

        return (
            <div className={'quest-header__interactive quest-header__interactive_join'}>
                <Button type={'primary'} size={'large'} block
                        onClick={() => setCurrentModal(TeamModal.CREATE_TEAM)}>Зарегистрироваться</Button>
                <p>{`до ${registrationHourMinute}\u00A0${registrationDayMonth}`}</p>
            </div>
        );
    }

    if (statusQuest === QuestStatus.StatusRegistrationDone) {
        return (
            <div className={'quest-header__interactive'}>
                <Button disabled size={'large'}>Регистрация завершена</Button>
            </div>
        );
    }

    if (statusQuest === QuestStatus.StatusRunning) {
        const finishHourMinute = finishDate.toLocaleString('ru', {hour: 'numeric', minute: '2-digit'});
        return (
            <div className={'quest-header__interactive'}>
                {team && <Button type={'primary'} style={{ backgroundColor: '#52C41A' }}><PlayCircleFilled />Открыть
                    задания</Button>}
                <p>{`Финиш квеста в ${finishHourMinute}`}</p>
            </div>
        );
    }

    if (statusQuest === QuestStatus.StatusWaitResults || statusQuest === QuestStatus.StatusFinished) {
        return (
            <div className={'quest-header__interactive'}>
                <Button disabled size={'large'}><FlagFilled />Квест завершен</Button>
            </div>
        );
    }

    return null;
}

const getQuestStatusLabel = (registrationDate: Date, status: string) => {
    const statusQuest = status as QuestStatus;
    if (statusQuest === QuestStatus.StatusOnRegistration) {
        const registrationDayMonth = registrationDate.toLocaleString('ru', {day: 'numeric', month: 'long'}).replace(' ', '\u00A0');
        return (
            <>
                <svg className={'quest-header__status_registration'} xmlns="http://www.w3.org/2000/svg" width="8"
                     height="8" fill="none" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="4" fill="black" />
                </svg>
                <p className={'quest-header__status quest-header__status_registration'}>
                    Регистрация до {registrationDayMonth}
                </p>
            </>
        );
    }

    if (statusQuest === QuestStatus.StatusRegistrationDone) {
        return (
            <>
                <svg className={'quest-header__status_registration-done'} xmlns="http://www.w3.org/2000/svg" width="8"
                     height="8" fill="none" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="4" fill="black" />
                </svg>
                <p className={'quest-header__status quest-header__status_registration-done'}>
                    Регистрация завершена
                </p>
            </>
        );
    }

    if (statusQuest === QuestStatus.StatusRunning) {
        return (
            <>
                <svg className={'quest-header__status_running'} xmlns="http://www.w3.org/2000/svg" width="8"
                     height="8" fill="none" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="4" fill="black" />
                </svg>
                <p className={'quest-header__status quest-header__status_running'}>
                    Идет сейчас
                </p>
            </>
        );
    }

    if (statusQuest === QuestStatus.StatusWaitResults) {
        return (
            <>
                <svg className={'quest-header__status_wait-results'} xmlns="http://www.w3.org/2000/svg" width="8"
                     height="8" fill="none" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="4" fill="black" />
                </svg>
                <p className={'quest-header__status quest-header__status_wait-results'}>
                    Считаем результаты
                </p>
            </>
        );
    }

    if (statusQuest === QuestStatus.StatusFinished) {
        return (
            <>
                <svg className={'quest-header__status_finished'} xmlns="http://www.w3.org/2000/svg" width="8"
                         height="8" fill="none" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="4" fill="black" />
                </svg>
                <p className={'quest-header__status quest-header__status_finished'}>
                    Завершен
                </p>
            </>
        );
    }

    return null;
};

export { getQuestStatusButton, getQuestStatusLabel, getStartDateText };
