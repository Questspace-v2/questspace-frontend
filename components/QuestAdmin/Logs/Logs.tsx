import { getPaginatedAnswerLogs } from '@/app/api/api';
import { IAnswerLog, IPaginatedAnswerLogs, IPaginatedAnswerLogsParams } from '@/app/types/quest-interfaces';
import { SmileOutlined } from '@ant-design/icons';
import { ConfigProvider, Empty, GetProp, Table, TablePaginationConfig, Tooltip } from 'antd';
import { TableProps } from 'antd/lib';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import Filters, { FilterSelectOptions, Option, SelectedFiltersState } from './Filters/Filters';

interface LogsProps {
    questId: string;
    paginatedLogs: IPaginatedAnswerLogs;
}

export default function Logs({questId, paginatedLogs}: LogsProps) {
    const [logsContent, setLogsContent] = useState<IAnswerLog[]>(paginatedLogs.answer_logs);
    const [nextPageToken, setNextPageToken] = useState(paginatedLogs.next_page_token);
    const [previousPageNumber, setPreviousPageNumber] = useState(1);
    const {data: session} = useSession();
    const [selectedFilters, setSelectedFilters] = useState<SelectedFiltersState>({});

    const getFilterId = useCallback((logField: keyof IAnswerLog, logFieldValue: string) =>
        logsContent.filter(item => item[logField] === logFieldValue)[0][logField].toString(), [logsContent]);

    useEffect(() => {
        const filterLogs = async () => {
            const queryParams: Partial<IPaginatedAnswerLogsParams> = {};
            if (selectedFilters.group) {
                queryParams.task_group_id = getFilterId('task_group', selectedFilters.group);
            }
            await getPaginatedAnswerLogs(questId, session?.accessToken, queryParams);
        };

        filterLogs().catch(err => {
            throw err;
        });
    }, [selectedFilters, getFilterId, questId, session?.accessToken]);

    const selectUniqueValues = (options: Option[]) => {
        const uniqueBuffer = new Set<string>();
        const result: Option[] = [];
        options.forEach(item => {
            if (!uniqueBuffer.has(item.value)) {
                result.push(item);
                uniqueBuffer.add(item.value);
            }
        });

        return result;
    };

    const getFilterOption = (logs: IAnswerLog[], field: 'task_group' | 'task' | 'team' | 'user') => {
        const result = logs.map(item => ({
            task_group_id: item.task_group_id,
            task_group: item.task_group,
            task_id: item.task_id,
            task: item.task,
            team_id: item.team_id,
            team: item.team,
            user_id: item.user_id,
            user: item.user,
        }));
        const fieldId: 'task_group_id' | 'task_id' | 'team_id' | 'user_id' = `${field}_id`
        const options = result.map(item => ({
            value: `${(item as IAnswerLog)[field]}_${(item as IAnswerLog)[fieldId]}`,
            label: (item as IAnswerLog)[field].toString(),
        }));
        
        return selectUniqueValues(options);
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
                <Filters 
                    options={filterSelectOptions}
                    setSelectedFilters={setSelectedFilters}
                />
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