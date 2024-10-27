import { getPaginatedAnswerLogs } from '@/app/api/api';
import { IAnswerLog, IPaginatedAnswerLogs } from '@/app/types/quest-interfaces';
import { Table } from 'antd';
import { TableProps } from 'antd/lib';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Logs({questId}: {questId: string}) {
    const [logsContent, setLogsContent] = useState<IAnswerLog[]>([]);
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
            key: 'task'
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

    useEffect(() => {
        const fetchTable = async () => {
            const result = await getPaginatedAnswerLogs(questId, session?.accessToken) as IPaginatedAnswerLogs;
            setLogsContent(result.answer_logs);
        };

        fetchTable()
            .catch(err => {
                throw err;
            });
    }, [questId, session?.accessToken]);

    return (
        <Table<IAnswerLog> 
            columns={columns} 
            dataSource={logsContent} 
            pagination={false}
            rowKey={(log) => log.answer_time}
            className='logs-table__table'
        />
    );
}