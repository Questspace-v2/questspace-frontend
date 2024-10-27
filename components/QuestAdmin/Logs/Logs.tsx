import { getPaginatedAnswerLogs } from '@/app/api/api';
import { IAnswerLog, IPaginatedAnswerLogs, IPaginatedAnswerLogsParams } from '@/app/types/quest-interfaces';
import { Table, TablePaginationConfig, Tooltip } from 'antd';
import { TableProps } from 'antd/lib';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

interface LogsProps {
    questId: string;
    paginatedLogs: IPaginatedAnswerLogs;
}

export default function Logs({questId, paginatedLogs}: LogsProps) {
    const [logsContent, setLogsContent] = useState<IAnswerLog[]>(paginatedLogs.answer_logs);
    const [nextPageToken, setNextPageToken] = useState(paginatedLogs.next_page_token);
    const [previousPageNumber, setPreviousPageNumber] = useState(1);
    const {data: session} = useSession();

    const columns: TableProps<IAnswerLog>['columns'] = [
        {
            title: 'Время',
            dataIndex: 'answer_time',
            key: 'answer_time',
            render: (time: string) => new Date(time).toLocaleString().replace(',', ''),
        },
        {
            title: 'Группа',
            dataIndex: 'task_group',
            key: 'task_group'
        },
        {
            title: 'Задание',
            dataIndex: 'task',
            key: 'task',
            render: (task: string) =>
                <Tooltip title={task}>
                    <span>{task}</span>
                </Tooltip>
        },
        {
            title: 'Команда',
            dataIndex: 'team',
            key: 'team'
        },
        {
            title: 'Пользователь',
            dataIndex: 'user',
            key: 'user',
            render: (_, record) => record.user ?? '—'
        },
        {
            title: 'Ответ',
            dataIndex: 'answer',
            key: 'answer',
            render: (_, record) =>
                <span className={classNames('logs-table__answer', record.accepted ? 'accepted' : 'rejected')}>{record.answer}</span>
        }
    ];

    const onPaginationChange = async (pagination: TablePaginationConfig) => {
        const currentPage = pagination.current ?? 1;
        const params: IPaginatedAnswerLogsParams = {
            page_id: currentPage - previousPageNumber === 1 ? nextPageToken.toString() : undefined,
            page_no: currentPage - previousPageNumber !== 1 ? currentPage - 1 : undefined,
            desc: true,
        };
        const result = await getPaginatedAnswerLogs(questId, session?.accessToken, params) as IPaginatedAnswerLogs;
        setLogsContent(result.answer_logs);
        setNextPageToken(result.next_page_token);
        setPreviousPageNumber(pagination.current ?? 1);
    };

    return (
        <Table<IAnswerLog> 
            columns={columns} 
            dataSource={logsContent} 
            rowKey={(log) => log.answer_time}
            pagination={{ total: 50 * paginatedLogs.total_pages, pageSize: 50, showSizeChanger: false }}
            onChange={onPaginationChange}
            className='logs-table__table'
        />
    );
}