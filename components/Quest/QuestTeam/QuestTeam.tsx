'use client';

import { ITeam } from '@/app/types/user-interfaces';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { QuestStatus } from '@/components/Quest/Quest.helpers';
import { Button, Collapse, CollapseProps, message, Modal } from 'antd';
import { CheckCircleOutlined, CopyOutlined, ExclamationCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { leaveTeam } from '@/app/api/api';
import { uid } from '@/lib/utils/utils';
import Image from 'next/image';
import classNames from 'classnames';
import { ReactElement } from 'react';


export default function QuestTeam({mode = 'block', team, session, status, extraButtons} : {
    mode: 'collapse' | 'block',
    team?: ITeam,
    session?: Session | null,
    status?: string,
    extraButtons?: ReactElement,
}) {
    const router = useRouter();
    const [modal, modalContextHolder] = Modal.useModal();
    const [messageApi, contextHolder] = message.useMessage();

    if (!team) {
        return null;
    }

    // const deleteMember = async (memberId: string) => {
    //     await deleteTeamMember(team.id, memberId, session?.accessToken);
    //     router.refresh();
    // };
    //
    // const changeCaptain = async (newCaptainId: string) => {
    //     await changeTeamCaptain(team.id, {new_captain_id: newCaptainId}, session?.accessToken);
    //     router.refresh();
    // };

    if (mode === 'collapse') {
        const nonInteractiveStatus =
            status === QuestStatus.StatusWaitResults ||
            status === QuestStatus.StatusFinished;

        const success = () => {
            // eslint-disable-next-line no-void
            void messageApi.open({
                type: 'success',
                content: 'Скопировано!',
            });
        };

        const showConfirm = async () => {
            await modal.confirm({
                title: 'Вы хотите выйти из команды?',
                icon: <ExclamationCircleOutlined />,
                className: 'confirm-delete__modal',
                cancelText: 'Нет',
                cancelButtonProps: { type: 'primary' },
                okText: 'Да',
                okType: 'default',
                centered: true,
                async onOk() {
                    const captainId = team.captain.id;
                    const isCaptain = captainId === session?.user.id;
                    if (isCaptain) {
                        const newCaptainId = team.members.filter(member => member.id !== captainId)[0]?.id;
                        await leaveTeam(team.id, session?.accessToken, newCaptainId ?? undefined);
                    } else {
                        await leaveTeam(team.id, session?.accessToken);
                    }
                    router.refresh();
                },
            }).then(confirmed => confirmed ? router.refresh() : {}, () => {
            });
        };

        const items: CollapseProps['items'] = [
            {
                key: team.id,
                label: (
                    <div className={'quest-team__header-wrapper'}>
                        <h2 className={classNames('quest-team__name', 'roboto-flex-header')}>{`Твоя команда — ${team.name}`}</h2>
                        <span className={'quest-team__status'}><CheckCircleOutlined /> Команда зарегистрирована</span>
                    </div>
                ),
                children: (
                    <>
                        {contextHolder}
                        <div className={'quest-team__members'}>
                            {team.members.map((member) => (
                                    <div key={uid()} className={`team-member__wrapper`}>
                                        <Image src={member.avatar_url} alt={''} width={32} height={32}
                                               style={{ borderRadius: '50%' }} aria-hidden />
                                        <span className={'team-member__name'}>{member.username}</span>
                                    </div>
                                ),
                            )}
                        </div>
                        {!nonInteractiveStatus && (
                            <>
                                <div className={'invite-link__wrapper'}>
                                    <p className={'invite-link__text'}>Пригласи друзей в свою команду — поделись ссылкой:</p>
                                    <Button className={'invite-link__link'} type={'link'} onClick={() => {
                                        navigator.clipboard.writeText(team.invite_link).then(() => success()).catch(err => {
                                            throw err;
                                        });
                                    }}>{team.invite_link} <CopyOutlined style={{ marginInlineStart: '3px' }} /></Button>
                                </div>
                                <Button
                                    className={'exit-team__button exit-team__small-screen'}
                                    icon={<LogoutOutlined />}
                                    block
                                    onClick={showConfirm}
                                    danger
                                >
                                    Выйти из команды
                                </Button>
                            </>
                        )}
                    </>
                ),
                extra: !nonInteractiveStatus &&
                    <>
                        <Button
                            className={'exit-team__button exit-team__large-screen'}
                            danger
                            icon={<LogoutOutlined />}
                            onClick={showConfirm}

                        >
                            Выйти из команды
                        </Button>
                        {modalContextHolder}
                    </>,
            },
        ];

        return (
            <Collapse
                ghost
                items={items}
                className={classNames('quest-team__collapse')}
                collapsible={'header'}
            />
        );
    }

    if (mode === 'block') {
        return (
            <div className={'quest-team__block'}>
                <div className={'quest-team__header-wrapper'}>
                    <h2 className={classNames('quest-team__name')}>{team.name}</h2>
                    {extraButtons && <div className={'quest-team__extra_header'}>{extraButtons}</div>}
                </div>
                {contextHolder}
                <div className={'quest-team__members'}>
                    {team.members.map((member) => (
                            <div key={uid()} className={`team-member__wrapper`}>
                                <Image src={member.avatar_url} alt={''} width={32} height={32}
                                       style={{ borderRadius: '50%' }} aria-hidden />
                                <span className={'team-member__name'}>{member.username}</span>
                            </div>
                        ),
                    )}
                    {extraButtons && <div className={'quest-team__extra_footer'}>{extraButtons}</div>}
                </div>
            </div>
        );
    }

    return null;
}
