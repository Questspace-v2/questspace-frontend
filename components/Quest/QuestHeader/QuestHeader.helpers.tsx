import { ITeam } from '@/app/types/user-interfaces';
import React, { Dispatch, SetStateAction } from 'react';
import { QuestStatus } from '@/components/Quest/Quest.helpers';
import { TeamModal, TeamModalType } from '@/lib/utils/modalTypes';
import { Button } from 'antd';
import { ArrowRightOutlined, CheckOutlined, FlagFilled, PlayCircleFilled } from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import Link from 'next/link';



const getStartDateText = (startDate: Date) => {
    const startDayMonth = startDate.toLocaleString('ru', {day: 'numeric', month: 'long'});
    const startHourMinute = startDate.toLocaleString('ru', {hour: 'numeric', minute: '2-digit'});

    return `${startDayMonth} в ${startHourMinute}`;
}

const getQuestStatusButton = (startDate: Date, registrationDate: Date,
                              finishDate: Date, status: string, currentModal: TeamModalType,
                              setCurrentModal: Dispatch<SetStateAction<TeamModalType>>, id: string, team?: ITeam, hasBrief?: boolean) => {
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
        if (hasBrief) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const pathname = usePathname();
            return (
                <div className={'quest-header__interactive quest-header__interactive_brief'}>
                    {team && (
                        <Link href={`${pathname}/play`}>
                            <Button tabIndex={-1} ghost>
                                Перейти к брифу <ArrowRightOutlined />
                            </Button>
                        </Link>
                    )}
                </div>
            );
        }

        return (
            <div className={'quest-header__interactive'}>
                <Button disabled size={'large'}>Регистрация завершена</Button>
            </div>
        );
    }

    if (statusQuest === QuestStatus.StatusRunning) {
        const finishHourMinute = finishDate.toLocaleString('ru', {hour: 'numeric', minute: '2-digit'});
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const pathname = usePathname();
        return (
            <div className={'quest-header__interactive quest-header__interactive_play'}>
                {team && (
                    <Link href={`${pathname}/play`}>
                        <Button type={'primary'} style={{ backgroundColor: 'var(--background-green)' }} tabIndex={-1}>
                            <PlayCircleFilled />Открыть задания
                        </Button>
                    </Link>
                )}
                <p>{`Финиш квеста в ${finishHourMinute}`}</p>
            </div>
        );
    }

    if (statusQuest === QuestStatus.StatusWaitResults || statusQuest === QuestStatus.StatusFinished) {
        return (
            <div className={'quest-header__interactive quest-header__interactive_finished'}>
                <Button disabled size={'large'}><FlagFilled />Квест завершен</Button>
            </div>
        );
    }

    return null;
}

export {getQuestStatusButton, getStartDateText};
