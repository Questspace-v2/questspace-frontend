import { getPaginatedAnswerLogs } from '@/app/api/api';
import { IAnswerLog, IPaginatedAnswerLogs, IPaginatedAnswerLogsParams } from '@/app/types/quest-interfaces';
import { SmileOutlined } from '@ant-design/icons';
import { ConfigProvider, Empty, GetProp, Table, TablePaginationConfig, Tooltip } from 'antd';
import { TableProps } from 'antd/lib';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { useTasksContext } from '@/components/Tasks/ContextProvider/ContextProvider';
import Filters, { SelectedFiltersState } from './Filters/Filters';

interface LogsProps {
    questId: string;
    paginatedLogs: IPaginatedAnswerLogs;
}

export default function Logs({questId, paginatedLogs}: LogsProps) {
    const [logsContent, setLogsContent] = useState<IAnswerLog[]>(paginatedLogs.answer_logs);
    const [nextPageToken, setNextPageToken] = useState(paginatedLogs.next_page_token);
    const [previousPageNumber, setPreviousPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(paginatedLogs.total_pages);
    const {data: session} = useSession();
    const [selectedFilters, setSelectedFilters] = useState<SelectedFiltersState>({});
    const { data: contextData } = useTasksContext()!;

    const getFilterId = useCallback((logFieldValue: string) => {
        const result = logFieldValue.split('_');
        return result[result.length - 1];
    }, []);

    const queryParams: IPaginatedAnswerLogsParams = {
        desc: true,
        task_group: selectedFilters.group ? getFilterId(selectedFilters.group) : undefined,
        task: selectedFilters.task ? getFilterId(selectedFilters.task) : undefined,
        team: selectedFilters.team ? getFilterId(selectedFilters.team) : undefined,
        user: selectedFilters.user ? getFilterId(selectedFilters.user) : undefined,
    };

    const onPaginationChange = async (pagination: TablePaginationConfig) => {
        const currentPage = pagination.current ?? 1;
        const params: IPaginatedAnswerLogsParams = {
            ...queryParams,
            page_id: currentPage - previousPageNumber === 1 ? nextPageToken.toString() : undefined,
            page_no: currentPage - previousPageNumber !== 1 ? currentPage - 1 : undefined,
            desc: true,
        };
        const result = await getPaginatedAnswerLogs(questId, session?.accessToken, params) as IPaginatedAnswerLogs;
        setLogsContent(result.answer_logs);
        setNextPageToken(result.next_page_token);
        setTotalPages(result.total_pages);
        setPreviousPageNumber(pagination.current ?? 1);
    };

    useEffect(() => {
        const filterLogs = async () => {
            if (selectedFilters.group) {
                queryParams.task_group = getFilterId(selectedFilters.group);
            }
            if (selectedFilters.task) {
                queryParams.task = getFilterId(selectedFilters.task);
            }
            if (selectedFilters.team) {
                queryParams.team = getFilterId(selectedFilters.team);
            }
            if (selectedFilters.user) {
                queryParams.user = getFilterId(selectedFilters.user);
            }
            const result = await getPaginatedAnswerLogs(questId, session?.accessToken, queryParams) as IPaginatedAnswerLogs;
            setLogsContent(result.answer_logs);
            setNextPageToken(result.next_page_token);
            setTotalPages(result.total_pages);
        };

        filterLogs().catch(err => {
            throw err;
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFilters]);

    const getOptions = () => {
        const groups = contextData.task_groups.map(item => ({
            value: `${item.name}_${item.id}`,
            label: item.name,
        }));
        const tasks = contextData.task_groups.map(item =>
            item.tasks.map(task => ({
                value: `${task.name}_${task.id}`,
                label: task.name,
            }))).flat();
        const teams = contextData.teams?.map(item => ({
            value: `${item.name}_${item.id}`,
            label: item.name,
        })) ?? [];
        const users = contextData.teams?.map(item => 
            item.members.map(member => ({
                value: `${member.username}_${member.id}`,
                label: member.username,
            }))).flat() ?? [];
        return {
            groups,
            tasks,
            teams,
            users,
        };
    };

    const filterSelectOptions = getOptions();

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
                    pagination={{ total: 50 * (totalPages + 1), pageSize: 50, showSizeChanger: false }}
                    onChange={onPaginationChange}
                    scroll={{ x: 1186 }}
                    className='logs-table__table'
                />
            </ConfigProvider>
        </ContentWrapper>
    );
}