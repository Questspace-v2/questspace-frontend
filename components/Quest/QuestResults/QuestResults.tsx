'use client';

import { QuestStatus } from '@/components/Quest/Quest.helpers';
import { IFinalLeaderboard, IFinalLeaderboardRow } from '@/app/types/quest-interfaces';
import { TrophyFilled } from '@ant-design/icons';
import { Table } from 'antd';
import Column from 'antd/lib/table/Column';
import React from 'react';

export default function QuestResults({ status, leaderboard }: { status: QuestStatus | string, leaderboard?: IFinalLeaderboard }) {
    const statusQuest = status as QuestStatus;

    if (statusQuest === QuestStatus.StatusFinished) {
        return (
            leaderboard && (
                <Table className={'results__table'} dataSource={leaderboard.rows} pagination={false} size={'small'} showHeader={false} rowKey={'team_name'}>
                    <Column
                        className={'results__team-index'}
                        key='team_index'
                        width={'36px'}
                        render={(_, record: IFinalLeaderboardRow, index: number) => `${index + 1}.`}
                        align={'right'}
                    />
                    <Column dataIndex={'team_name'} key={'team_name'}/>
                    <Column dataIndex={'score'} key={'score'} width={'50px'} align={'right'} render={(_, record: IFinalLeaderboardRow) => record.score}/>
                    <Column
                        className={'results__team-place'}
                        key={'place'}
                        render={(_, record: IFinalLeaderboardRow, index) => {
                            if (index + 1 === 1) {
                                return <TrophyFilled style={{color: '#FADB14'}}/>
                            }
                            if (index + 1 === 2) {
                                return <TrophyFilled style={{color: '#D9D9D9'}}/>
                            }
                            if (index + 1 === 3) {
                                return <TrophyFilled style={{color: '#D46B08'}}/>
                            }

                            return null;
                        }}
                        align={'right'}
                        width={16}
                    />
                </Table>
            )
        )
    }

    return null;
}
