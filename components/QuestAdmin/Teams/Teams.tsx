import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { ITeam } from '@/app/types/user-interfaces';
import classNames from 'classnames';
import React from 'react';
import QuestTeam from '@/components/Quest/QuestTeam/QuestTeam';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Teams({teams, questId}: {teams: ITeam[], questId: string}) {
    return (
        <ContentWrapper className={'teams__content-wrapper'}>
            <div className={'teams__wrapper'}>
                <div className={'approved-teams__wrapper'}>
                    <h2 className={classNames('roboto-flex-header', 'approved-teams__header')}>Принятые команды</h2>
                    {teams?.map((team: ITeam) => (
                        <div className={'team__wrapper'} key={team.id}>
                            <QuestTeam mode={'block'} team={team} />
                        </div>
                    ))}
                </div>
            </div>
        </ContentWrapper>
    );
}
