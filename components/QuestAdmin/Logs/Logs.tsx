import { IAnswerLog, IPaginatedAnswerLogs } from '@/app/types/quest-interfaces';
import { Table } from 'antd';
import { TableProps } from 'antd/lib';

export default function Logs({paginatedAnswerLogs}: {paginatedAnswerLogs: IPaginatedAnswerLogs}) {
    const columns: TableProps<IAnswerLog>['columns'] = [
        {
            title: 'Время',
            dataIndex: 'answer_time',
            key: 'answer_time'
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
            key: 'user'
        },
        {
            title: 'Ответ',
            dataIndex: 'answer',
            key: 'answer'
        }
    ];

    const dataSource = paginatedAnswerLogs.answer_logs;

    return (
        <Table<IAnswerLog> columns={columns} dataSource={dataSource}/>
    );
}