import React from 'react';

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
        const minutes = Math.floor(Math.abs(startDate.getTime() - finishDate.getTime()) / 6e4);
        return `${minutes}\u00A0${declOfNum(minutes, ['минута', 'минуты', 'минут'])}`;
    }
    if (hours >= 24) {
        const days = Math.floor(hours / 24);
        return `${days}\u00A0${declOfNum(days, ['день', 'дня', 'дней'])}`;
    }
    return `${Math.floor(hours)}\u00A0${declOfNum(Math.floor(hours), ['час', 'часа', 'часов'])}`;
}

export function getLongTimeDiff(startDate: Date, finishDate: Date) {
    const minutes = Math.floor(Math.abs(startDate.getTime() - finishDate.getTime()) / 6e4);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const modHours = hours % 24;
    const modMinutes = minutes % 60;
    const daysLabel = days > 0 ? `${days}\u00A0${declOfNum(days, ['день', 'дня', 'дней'])}` : '';
    const hoursLabel = modHours > 0 ? `${modHours}\u00A0${declOfNum(modHours, ['час', 'часа', 'часов'])}` : '';
    const minutesLabel = modMinutes > 0 ?`${modMinutes}\u00A0${declOfNum(modMinutes, ['минута', 'минуты', 'минут'])}` : '';

    return [daysLabel, hoursLabel, minutesLabel].join(' ');
}

export function getRemainingVerb(startDate: Date, finishDate: Date) {
    const minutes = Math.floor(Math.abs(startDate.getTime() - finishDate.getTime()) / 6e4);

    if (minutes < 60) {
        return declOfNum(minutes, ['Осталась', 'Осталось', 'Осталось']);
    }

    if (minutes < 1440) {
        return declOfNum(Math.floor(minutes / 60), ['Остался', 'Осталось', 'Осталось']);
    }

    return declOfNum(Math.floor(minutes / 1440), ['Остался', 'Осталось', 'Осталось']);
}

export function getQuestStatusLabel(registrationDate: Date, status: string) {
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
}
