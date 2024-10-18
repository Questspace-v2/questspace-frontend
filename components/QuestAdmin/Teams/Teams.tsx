import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { ITeam } from '@/app/types/user-interfaces';
import classNames from 'classnames';
import React, { useState } from 'react';
import QuestTeam from '@/components/Quest/QuestTeam/QuestTeam';
import { Button, Collapse, CollapseProps, Empty, message, Popconfirm } from 'antd';
import {
    CheckCircleOutlined,
    CheckOutlined,
    DeleteOutlined,
    SmileOutlined,
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { acceptTeam, deleteTeam } from '@/app/api/api';


const emptyAcceptedTeams = (
    <Empty
        className={'empty__teams-not-found'}
        image={<SmileOutlined />}
        description={
            <span>
                Команд нет
            </span>
        }
    />
);


export default function Teams({teams, questId, registrationType = 'AUTO'}: {teams: ITeam[], questId: string, registrationType?: 'AUTO' | 'VERIFY'}) {
    const [messageApi, contextHolder] = message.useMessage();

    const [acceptedTeams, setAcceptedTeams] = useState(
        teams?.filter((team) => team.registration_status === 'ACCEPTED')
    );
    const [requestedTeams, setRequestedTeams] = useState(
        teams?.filter((team) => team.registration_status === 'ON_CONSIDERATION')
    );
    const { data } = useSession();
    const { accessToken } = data!;

    const handleRequestTeam = async (action: 'accept' | 'decline', targetTeam: ITeam) => {
        if (action === 'accept') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const response = await acceptTeam(questId, targetTeam.id, accessToken) as {teams: ITeam[]};

            if (response.teams) {
                setRequestedTeams(prevState => prevState?.filter((team) => team.id !== targetTeam.id));
                setAcceptedTeams(prevState => [...prevState, targetTeam]);
                return 200;
            }
        }

        if (action === 'decline') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const response = await deleteTeam(targetTeam.id, accessToken) as number;

            if (response === 200) {
                setRequestedTeams(prevState => [...prevState, targetTeam]);
                return response;
            }
        }

        return null;
    };

    const handleAcceptedTeam = async (action: 'delete', targetTeam: ITeam) => {
        if (action === 'delete') {
            const response = await deleteTeam(targetTeam.id, accessToken) as number;
            if (response === 200) {
                setAcceptedTeams(prevState => prevState?.filter((team) => team.id !== targetTeam.id));
                return response;
            }
        }

        return null;
    }

    const confirmDeleteTeam = async (team: ITeam) => {
        const response = await handleAcceptedTeam('delete', team);

        if (response === 200) {
            // eslint-disable-next-line no-void
            void messageApi.open({
                type: 'success',
                content: 'Команда удалена',
            });
        } else {
            // eslint-disable-next-line no-void
            void messageApi.open({
                type: 'error',
                content: 'Не удалось удалить команду',
            });
        }
    };

    const confirmAcceptAll = () => {
        let isSuccess = true;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        requestedTeams?.map(async team => {
            isSuccess = isSuccess && await handleRequestTeam('accept', team) === 200;
        })

        if (isSuccess) {
            // eslint-disable-next-line no-void
            void messageApi.open({
                type: 'success',
                content: 'Все заявки приняты',
            });
        } else {
            // eslint-disable-next-line no-void
            void messageApi.open({
                type: 'error',
                content: 'Произошла ошибка',
            });
        }
    };

    const items: CollapseProps['items'] = [
        {
            key: 'requested-teams',
            label: <h2 className={'requested-teams__header'}>Заявки на участие <span className={'light-description'}>({requestedTeams?.length})</span></h2>,
            children: (
                <div className={'requested-teams__wrapper'}>
                    {requestedTeams?.map((team: ITeam) => (
                        <div className={'team__wrapper'} key={team.id}>
                            <QuestTeam
                                mode={'block'}
                                team={team}
                                extraButtons={
                                    <div className={'requested-team__extra'}>
                                        <Button ghost block onClick={() => handleRequestTeam('accept', team)}>
                                            <CheckOutlined /> Принять
                                        </Button>
                                        <Button danger block onClick={() => handleRequestTeam('decline', team)}>
                                            <DeleteOutlined /> Отклонить
                                        </Button>
                                    </div>
                                }
                            />
                        </div>
                    ))}
                </div>
            ),
            headerClass: classNames(
                'requested-teams__collapse-header',
            ),
            extra: requestedTeams?.length > 0 && (
                <div className={'requested-teams__extra'}>
                    <Popconfirm
                        placement="bottomRight"
                        title="Принять все заявки?"
                        onConfirm={confirmAcceptAll}
                        okText="Да"
                        cancelText="Нет"
                    >
                        <Button ghost block>
                            <CheckCircleOutlined /> Принять все
                        </Button>
                    </Popconfirm>
                </div>
            )
        },
    ];

return (
    <ContentWrapper className={'teams__content-wrapper'}>
        <div className={'teams__wrapper'}>
            {contextHolder}
            {(registrationType === 'VERIFY' || requestedTeams?.length > 0) && (
                <Collapse
                    ghost
                    items={items}
                    collapsible={'header'}
                />
            )}
            <div className={'approved-teams__wrapper'}>
                <h2 className={classNames('approved-teams__header')}>Принятые команды</h2>
                {!acceptedTeams || acceptedTeams.length === 0 && (emptyAcceptedTeams)}
                {acceptedTeams?.map((team: ITeam) => (
                    <div className={'team__wrapper'} key={team.id}>
                        <QuestTeam
                            mode={'block'}
                            team={team}
                            extraButtons={
                                <div className={'accepted-team__extra'}>
                                    <Popconfirm
                                        placement="bottomRight"
                                        title="Удалить команду из игры?"
                                        onConfirm={() => confirmDeleteTeam(team)}
                                        okText="Да"
                                        cancelText="Нет"
                                    >
                                    <Button danger block >
                                        <DeleteOutlined /> Удалить из игры
                                    </Button>
                                    </Popconfirm>
                                </div>
                            }
                        />
                    </div>
                ))}
            </div>
        </div>
    </ContentWrapper>
);
}
