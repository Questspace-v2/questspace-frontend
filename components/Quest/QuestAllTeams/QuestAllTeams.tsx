'use client';

import { ITeam } from '@/app/types/user-interfaces';
import { Table, TableColumnsType } from 'antd';
import React from 'react';

export default function QuestAllTeams({allTeams, currentTeam} : {allTeams?: ITeam[], currentTeam?: ITeam}) {
    const columns: TableColumnsType<ITeam> = [
        {
            dataIndex: 'index',
            key: 'index',
            render: (_, record, index) => `${index + 1}.`,
            align: 'right',
            width: 36
        },
        {
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => {
                if (record.id === currentTeam?.name) {
                    return <span style={{fontWeight: 700}}>{record.name}</span>;
                }
                return record.name;
            },
        },
    ]

    return (
        <Table
            className={'quest-page__all-teams-table'}
            dataSource={allTeams}
            rowKey={'id'}
            columns={columns}
            pagination={false}
            size={'small'}
            showHeader={false}
        />
    );
}
