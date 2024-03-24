import { QuestStatus } from '@/components/Quest/Quest';
import { Button } from 'antd';
import { FlagFilled, PlayCircleFilled } from '@ant-design/icons';

import './QuestCard.css';
import { IUser } from '@/app/types/user-interfaces';

export interface QuestHeaderProps {
    creator: IUser,
    start_time: string,
    finish_time: string,
    media_link: string,
    name: string,
    registration_deadline: string,
    status: string
}

function declOfNum(number: number, titles: string[]) {
    const cases: number[] = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

export function getTimeDiff(startDate: Date, finishDate: Date) {
    const hours = Math.abs(startDate.getTime() - finishDate.getTime()) / 36e5;
    if (hours >= 24) {
        const days = Math.floor(hours / 24);
        return `${days}\u00A0${declOfNum(days, ['день', 'дня', 'дней'])}`;
    }
    return `${hours}\u00A0${declOfNum(hours, ['час', 'часа', 'часов'])}`;
}
const getQuestCardStatusButton = (startDate: Date, registrationDate: Date, finishDate: Date, status: string) => {
    if (status === QuestStatus.StatusOnRegistration) {
        const registrationDayMonth = registrationDate.toLocaleString('ru', {day: 'numeric', month: 'long'}).replace(' ', '\u00A0');
        const registrationHourMinute = registrationDate.toLocaleString('ru', {hour: 'numeric', minute: '2-digit'});

        return (
            <div className={'quest-card__interactive quest-card__interactive_join'}>
                <Button type={'primary'} size={'large'} block>Зарегистрироваться</Button>
                <p>{`до ${registrationHourMinute}\u00A0${registrationDayMonth}`}</p>
            </div>
        );
    }

    if (status === QuestStatus.StatusRegistrationDone) {
        return (
            <div className={'quest-card__interactive'}>
                <Button disabled size={'large'}>Регистрация завершена</Button>
            </div>
        );
    }

    if (status === QuestStatus.StatusRunning) {
        const finishHourMinute = finishDate.toLocaleString('ru', {hour: 'numeric', minute: '2-digit'});
        return (
            <div className={'quest-card__interactive'}>
                <Button type={'primary'} style={{ backgroundColor: '#52C41A' }}><PlayCircleFilled />Открыть
                    задания</Button>
                <p>{`Финиш квеста в ${finishHourMinute}`}</p>
            </div>
        );
    }

    if (status === QuestStatus.StatusWaitResults || status === QuestStatus.StatusFinished) {
        return (
            <div className={'quest-card__interactive'}>
                <Button disabled size={'large'}><FlagFilled />Квест завершен</Button>
            </div>
        );
    }

    return;
}

export { getQuestCardStatusButton };
