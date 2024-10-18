import { ITeam } from '@/app/types/user-interfaces';
import React, { Dispatch, SetStateAction } from 'react';
import { declOfNum, QuestStatus } from '@/components/Quest/Quest.helpers';
import { TeamModal, TeamModalType } from '@/lib/utils/modalTypes';
import { Button } from 'antd';
import {
    ArrowRightOutlined,
    CheckOutlined,
    ClockCircleOutlined,
    FlagFilled,
    PlayCircleFilled,
} from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { IQuest } from '@/app/types/quest-interfaces';


const getStartDateText = (startDate: Date) => {
    const startDayMonth = startDate.toLocaleString('ru', {day: 'numeric', month: 'long'});
    const startHourMinute = startDate.toLocaleString('ru', {hour: 'numeric', minute: '2-digit'});

    return `${startDayMonth} в ${startHourMinute}`;
}

const getQuestRegistrationButton = (
    startDate: Date,
    registrationDate: Date,
    setCurrentModal: Dispatch<SetStateAction<TeamModalType>>,
    props: IQuest,
    team?: ITeam,
    teamsAccepted = 0
) => {
    const {
        registration_type: registrationType = 'AUTO',
        max_teams_amount: maxTeamsAmount = null,
        has_brief: hasBrief
    } = props;

    const registrationDayMonth = registrationDate.toLocaleString('ru', {
        day: 'numeric',
        month: 'long',
    }).replace(' ', '\u00A0');
    const registrationHourMinute = registrationDate.toLocaleString('ru', {
        hour: 'numeric', minute: '2-digit'
    });
    const startDateDayMonth = startDate.toLocaleString('ru', {day: 'numeric', month: 'long'}).replace(' ', '\u00A0');
    const startDateHourMinute = startDate.toLocaleString('ru', {hour: 'numeric', minute: '2-digit'});
    const teamsRemaining = (maxTeamsAmount ?? 0) - teamsAccepted;

    if (team?.registration_status === 'ACCEPTED') {
        if (hasBrief) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const pathname = usePathname();
            return (
                <div className={'quest-header__interactive quest-header__interactive_brief'}>
                    {team && (
                        <Link href={`${pathname}/play`}>
                            <Button tabIndex={-1} ghost size={'large'}>
                                Перейти к брифу <ArrowRightOutlined />
                            </Button>
                        </Link>
                    )}
                </div>
            );
        }

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

    if (!team && maxTeamsAmount && teamsRemaining <= 0) {
        return (
            <div className={'quest-header__interactive'}>
                <Button disabled size={'large'}>Места закончились</Button>
                <p>{`Регистрация до ${registrationHourMinute}\u00A0${registrationDayMonth}`}</p>
            </div>
        );
    }

    if (registrationType === 'AUTO') {
        if (team) {
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

        return (
            <div className={'quest-header__interactive quest-header__interactive_join'}>
                <Button type={'primary'} size={'large'} block
                        onClick={() => setCurrentModal(TeamModal.CREATE_TEAM)}>Зарегистрироваться</Button>
                <p>{`Регистрация до ${registrationHourMinute}\u00A0${registrationDayMonth}`}</p>
                {maxTeamsAmount &&
                    <p>{`Осталось ${teamsRemaining}\u00A0${declOfNum(teamsRemaining, ['место', 'места', 'мест'])}`}</p>
                }
            </div>
        );
    }

    // registration_type === 'VERIFY'
    if (team?.registration_status === 'ON_CONSIDERATION') {
        return (
            <div className={'quest-header__interactive'}>
                <Button size={'large'} disabled ghost block>
                    <ClockCircleOutlined/>
                    Заявка отправлена
                </Button>
                {hasBrief && <p>После утверждения заявки откроется доступ к брифу</p>}
            </div>
        );
    }

    return (
        <div className={'quest-header__interactive quest-header__interactive_join'}>
            <Button type={'primary'} size={'large'} block
                    onClick={() => setCurrentModal(TeamModal.CREATE_TEAM)}>Подать заявку</Button>
            <p>{`Регистрация до ${registrationHourMinute}\u00A0${registrationDayMonth}`}</p>
            {maxTeamsAmount &&
                <p>{`Осталось ${teamsRemaining}\u00A0${declOfNum(teamsRemaining, ['место', 'места', 'мест'])}`}</p>
            }
        </div>
    );
}

const getQuestStatusButton = (
    startDate: Date,
    registrationDate: Date,
    finishDate: Date,
    currentModal: TeamModalType,
    setCurrentModal: Dispatch<SetStateAction<TeamModalType>>,
    props: IQuest,
    team?: ITeam,
    teamsAccepted?: number
) => {
    const {
        status,
        has_brief: hasBrief
    } = props;
    const statusQuest = status as QuestStatus;

    if (statusQuest === QuestStatus.StatusOnRegistration) {
        return getQuestRegistrationButton(startDate, registrationDate, setCurrentModal, props, team, teamsAccepted);
    }

    if (statusQuest === QuestStatus.StatusRegistrationDone) {
        if (hasBrief) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const pathname = usePathname();
            return (
                <div className={'quest-header__interactive quest-header__interactive_brief'}>
                    {team && (
                        <Link href={`${pathname}/play`}>
                            <Button tabIndex={-1} ghost size={'large'}>
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
                        <Button type={'primary'} style={{ backgroundColor: 'var(--background-green)' }} tabIndex={-1} size={'large'}>
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
