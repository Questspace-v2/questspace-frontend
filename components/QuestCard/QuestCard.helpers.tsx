import { Button } from 'antd';
import { FlagFilled, PlayCircleFilled } from '@ant-design/icons';
import { IUser } from '@/app/types/user-interfaces';

import './QuestCard.css';

export interface QuestHeaderProps {
    creator: IUser,
    start_time: string,
    finish_time: string,
    media_link: string,
    name: string,
    registration_deadline: string,
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
    return `${Math.floor(hours)}\u00A0${declOfNum(hours, ['час', 'часа', 'часов'])}`;
}
const getQuestCardStatusButton = (startDate: Date, registrationDate: Date, finishDate: Date, status: string) => {
    const statusQuest = status as QuestStatus;
    if (statusQuest === QuestStatus.StatusOnRegistration) {
        const registrationDayMonth = registrationDate.toLocaleString('ru', {day: 'numeric', month: 'long'}).replace(' ', '\u00A0');
        const registrationHourMinute = registrationDate.toLocaleString('ru', {hour: 'numeric', minute: '2-digit'});

        return (
            <div className={'quest-card__interactive quest-card__interactive_join'}>
                <Button type={'primary'} size={'large'} block>Зарегистрироваться</Button>
                <p>{`до ${registrationHourMinute}\u00A0${registrationDayMonth}`}</p>
            </div>
        );
    }

    if (statusQuest === QuestStatus.StatusRegistrationDone) {
        return (
            <div className={'quest-card__interactive'}>
                <Button disabled size={'large'}>Регистрация завершена</Button>
            </div>
        );
    }

    if (statusQuest === QuestStatus.StatusRunning) {
        const finishHourMinute = finishDate.toLocaleString('ru', {hour: 'numeric', minute: '2-digit'});
        return (
            <div className={'quest-card__interactive'}>
                <Button type={'primary'} style={{ backgroundColor: '#52C41A' }}><PlayCircleFilled />Открыть
                    задания</Button>
                <p>{`Финиш квеста в ${finishHourMinute}`}</p>
            </div>
        );
    }

    if (statusQuest === QuestStatus.StatusWaitResults || statusQuest === QuestStatus.StatusFinished) {
        return (
            <div className={'quest-card__interactive'}>
                <Button disabled size={'large'}><FlagFilled />Квест завершен</Button>
            </div>
        );
    }

    return null;
}

export { getQuestCardStatusButton };
