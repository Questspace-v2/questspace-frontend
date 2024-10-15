import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { ITeam } from '@/app/types/user-interfaces';
import classNames from 'classnames';
import React from 'react';
import QuestTeam from '@/components/Quest/QuestTeam/QuestTeam';
import { Collapse, CollapseProps } from 'antd';
import BriefEditButtons from '@/components/Tasks/Brief/BriefEditButtons/BriefEditButtons';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Teams({teams, questId}: {teams: ITeam[], questId: string}) {
    const acceptedTeams = teams?.filter((team) => team.registration_status === 'ACCEPTED');
    const requestedTeams = teams?.filter((team) => team.registration_status === 'ON_CONSIDERATION');

    const items: CollapseProps['items'] = [
        {
            key: 'requested-teams',
            label: <span>Заявки на участие <span className={'light-description'}>({requestedTeams?.length})</span></span>,
            children: (
                <div className={'requested-teams__wrapper'}>
                    {requestedTeams?.map((team: ITeam) => (
                        <div className={'team__wrapper'} key={team.id}>
                            <QuestTeam mode={'block'} team={team} />
                        </div>
                    ))}
                </div>
            ),
            headerClass: classNames(
                'requested-teams__header',
                'roboto-flex-header',
            ),
        },
    ];

    return (
        <ContentWrapper className={'teams__content-wrapper'}>
            <div className={'teams__wrapper'}>
                {requestedTeams?.length > 0 && (
                    <Collapse
                        ghost
                        items={items}
                        collapsible={'header'}
                    />
                )}
                <div className={'approved-teams__wrapper'}>
                    <h2 className={classNames('roboto-flex-header', 'approved-teams__header')}>Принятые команды</h2>
                    {acceptedTeams?.map((team: ITeam) => (
                        <div className={'team__wrapper'} key={team.id}>
                            <QuestTeam mode={'block'} team={team} />
                        </div>
                    ))}
                </div>
            </div>
        </ContentWrapper>
    );
}
