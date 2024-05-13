import { IAdminLeaderboardResponse } from '@/app/types/quest-interfaces';
import { Table } from 'antd';
import Column from 'antd/lib/table/Column';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';

import './Leaderboard.css'
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';

export default function Leaderboard({teams}: {teams: IAdminLeaderboardResponse}) {
    const {xs} = useBreakpoint();
    if (!teams.results?.length) {
        return null;
    }

    return (
        <ContentWrapper className={'leaderboard__content-wrapper'}>
        <div className={'leaderboard__wrapper'}>
            <Table dataSource={teams.results} pagination={false} bordered scroll={{ x: true}} rowKey={'team_name'}>
                <Column title={'Имя участника'} dataIndex={'team_name'} key={'team-name'} fixed={!xs ? 'left' : false}/>
                <Column title={'Сумма'} dataIndex={'total_score'} key={"total-score"} fixed={!xs ? 'left' : false}/>
                <Column title={'Баллы'} dataIndex={'task_score'} key={'task_score'}/>
                <Column title={'Штраф'} dataIndex={'penalty'} key={'penalty'} />
                {teams.task_groups?.map((group, group_index) => (
                        <ColumnGroup title={group.name} key={group.id}>
                            {group.tasks?.map((task, task_index) =>
                                <Column title={task.name} key={task.id} dataIndex={`task_${group_index}_${task_index}_score`}/>
                            )}
                        </ColumnGroup>
                    ))}
            </Table>
        </div>
        </ContentWrapper>
    );
}
