import { getPaginatedAnswerLogs } from '@/app/api/api';
import { IAnswerLog, IPaginatedAnswerLogs, IPaginatedAnswerLogsParams } from '@/app/types/quest-interfaces';
import { SmileOutlined } from '@ant-design/icons';
import { ConfigProvider, Empty, GetProp, Table, TablePaginationConfig, Tooltip } from 'antd';
import { TableProps } from 'antd/lib';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import Filters, { FilterSelectOptions } from './Filters/Filters';

interface LogsProps {
    questId: string;
    paginatedLogs: IPaginatedAnswerLogs;
}

export default function Logs({questId, paginatedLogs}: LogsProps) {
    const [logsContent, setLogsContent] = useState<IAnswerLog[]>(paginatedLogs.answer_logs);
    const [nextPageToken, setNextPageToken] = useState(paginatedLogs.next_page_token);
    const [previousPageNumber, setPreviousPageNumber] = useState(1);
    const {data: session} = useSession();

    const getFilterOption = (logs: IAnswerLog[], field: keyof IAnswerLog) => {
        const result = Array.from(new Set(logs.map(item => item[field].toString())));
        return result.map(item => ({
            value: item,
            label: item,
        }));
    };

    const [filterSelectOptions, setFilterSelectOptions] = useState<FilterSelectOptions>({
        groups: getFilterOption(paginatedLogs.answer_logs, 'task_group'),
        tasks: getFilterOption(paginatedLogs.answer_logs, 'task'),
        teams: getFilterOption(paginatedLogs.answer_logs, 'team'),
        users: getFilterOption(paginatedLogs.answer_logs, 'user'),
    });

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
            key: 'task_group',
            render: (_, record) =>
                <Tooltip title={record.task_group} placement='topLeft'>
                    {record.task_group}
                </Tooltip>
        },
        {
            title: 'Задание',
            dataIndex: 'task',
            key: 'task',
            render: (task: string) =>
                <Tooltip title={task} placement='topLeft'>
                    <span>{task}</span>
                </Tooltip>
        },
        {
            title: 'Команда',
            dataIndex: 'team',
            key: 'team',
            render: (_, record) =>
                <Tooltip title={record.team} placement='topLeft'>
                    {record.team}
                </Tooltip>
        },
        {
            title: 'Пользователь',
            dataIndex: 'user',
            key: 'user',
            render: (_, record) =>
                <Tooltip title={record.user ?? '—'} placement='topLeft'>
                    {record.user ?? '—'}
                </Tooltip>
        },
        {
            title: 'Ответ',
            dataIndex: 'answer',
            key: 'answer',
            render: (_, record) =>
                <Tooltip title={record.answer} placement='topLeft'>
                    <span className={classNames('logs-table__answer', record.accepted ? 'accepted' : 'rejected')}>
                        {record.answer}
                    </span>
                </Tooltip>
        }
    ];

    const renderEmpty: GetProp<typeof ConfigProvider, 'renderEmpty'> = () => (
        <Empty
            className={'empty__logs-not-found'}
            image={<SmileOutlined />}
            description={<span>
                Записей пока нет
            </span>} />
    );

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
        setFilterSelectOptions({
            groups: getFilterOption(result.answer_logs, 'task_group'),
            tasks: getFilterOption(result.answer_logs, 'task'),
            teams: getFilterOption(result.answer_logs, 'team'),
            users: getFilterOption(result.answer_logs, 'user'),
        });
    };

    return (
        <ContentWrapper>
            <ConfigProvider renderEmpty={renderEmpty}>
                <Filters options={filterSelectOptions} />
                <Table<IAnswerLog> 
                    columns={columns} 
                    dataSource={logsContent} 
                    rowKey={(log) => log.answer_time}
                    pagination={{ total: 50 * paginatedLogs.total_pages, pageSize: 50, showSizeChanger: false }}
                    onChange={onPaginationChange}
                    scroll={{ x: 1186 }}
                    className='logs-table__table'
                />
            </ConfigProvider>
        </ContentWrapper>
    );
}