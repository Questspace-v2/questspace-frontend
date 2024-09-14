import {
    IAdminLeaderboardResponse,
    IAdminLeaderboardResult,
    IAdminTaskGroup,
} from '@/app/types/quest-interfaces';
import { Table, TableColumnsType } from 'antd';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { RELEASED_FEATURE } from '@/app/api/client/constants';
import EditPenalty from '@/components/QuestAdmin/Leaderboard/EditPenalty/EditPenalty';
import {useEffect, useState} from 'react';
import {getLeaderboardAdmin} from '@/app/api/api';
import {useSession} from 'next-auth/react';

export default function Leaderboard({teams, questId}: {teams: IAdminLeaderboardResponse, questId: string}) {
    const {xs} = useBreakpoint();
    const [shouldUpdatePenalty, setShouldUpdatePenalty] = useState(false);
    const {data: session} = useSession();
    const [leaderboardContent, setLeaderboardContent] = useState(teams);

    useEffect(() => {
        const fetchTable = async () => {
            const result =
                await getLeaderboardAdmin(questId, session?.accessToken) as IAdminLeaderboardResponse;
            setLeaderboardContent(result);
        };

        fetchTable()
            .catch(err => {
                throw err;
            });
    }, [session, questId, shouldUpdatePenalty]);

    if (!leaderboardContent.results?.length) {
        return null;
    }

    const columns: TableColumnsType<IAdminLeaderboardResult | IAdminTaskGroup> = [
        {
            title: 'Имя участника',
            dataIndex: 'team_name',
            key: 'team_name',
            fixed: !xs ? 'left' : false
        },
        {
            title: 'Сумма',
            dataIndex: 'total_score',
            key: 'total_score',
            fixed: !xs ? 'left' : false
        },
        {
            title: 'Баллы',
            dataIndex: 'task_score',
            key: 'task_score',
        },
        {
            title: RELEASED_FEATURE ? 'Бонус' : 'Штраф',
            dataIndex: 'penalty',
            key: 'penalty',
            className: 'leaderboard__penalty',
            render: (_, record) => (
                RELEASED_FEATURE ? <>
                    {-1 * (record as IAdminLeaderboardResult).penalty}
                    <EditPenalty
                        record={(record as IAdminLeaderboardResult)}
                        questId={questId}
                        setShouldUpdateTable={setShouldUpdatePenalty}
                    />
                </> : <span>{(record as IAdminLeaderboardResult).penalty}</span>
            )
        },
        ...leaderboardContent.task_groups!.map((group, group_index) => ({
            title: group.name,
            key: group.id,
            children: group.tasks?.map((task, task_index) => ({
                title: task.name,
                dataIndex: task.id,
                key: `task_${group_index}_${task_index}_score`,
                render: (_: string, record: IAdminLeaderboardResult) =>
                    <span>{record[`task_${group_index}_${task_index}_score`]}</span>
            }))
        }))
    ]

    return (
        <ContentWrapper className={'leaderboard__content-wrapper'}>
        <div className={'leaderboard__wrapper'}>
            <Table className={'leaderboard__table'} dataSource={leaderboardContent.results} columns={columns} pagination={false} bordered scroll={{ x: true}} rowKey={'team_name'} />
        </div>
        </ContentWrapper>
    );
}
