import { getPaginatedAnswerLogs } from '@/app/api/api';
import { IAnswerLog, IPaginatedAnswerLogs, IPaginatedAnswerLogsParams } from '@/app/types/quest-interfaces';
import { SmileOutlined } from '@ant-design/icons';
import { ConfigProvider, Empty, GetProp, Table, TablePaginationConfig, Tooltip } from 'antd';
import { TableProps } from 'antd/lib';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useTasksContext } from '@/components/Tasks/ContextProvider/ContextProvider';
import Filters, { SelectedFiltersState } from './Filters/Filters';
import InfoAlert from './InfoAlert/InfoAlert';

interface LogsProps {
    questId: string;
    paginatedLogs: IPaginatedAnswerLogs;
    isInfoAlertHidden: boolean;
    setIsInfoAlertHidden: Dispatch<SetStateAction<boolean>>;
}

export const LOGS_PAGE_SIZE = 50;

export default function Logs({questId, paginatedLogs, isInfoAlertHidden, setIsInfoAlertHidden}: LogsProps) {
    const [logsContent, setLogsContent] = useState<IAnswerLog[]>(paginatedLogs.answer_logs);
    const [nextPageToken, setNextPageToken] = useState(paginatedLogs.next_page_token);
    const [currentPage, setCurrentPage] = useState(1);
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
        page_size: LOGS_PAGE_SIZE,
        task_group: selectedFilters.group ? getFilterId(selectedFilters.group) : undefined,
        task: selectedFilters.task ? getFilterId(selectedFilters.task) : undefined,
        team: selectedFilters.team ? getFilterId(selectedFilters.team) : undefined,
        user: selectedFilters.user ? getFilterId(selectedFilters.user) : undefined,
        accepted_only: selectedFilters.accepted_only ? selectedFilters.accepted_only : undefined,
    };

    const onPaginationChange = async (pagination: TablePaginationConfig) => {
        const currPage = pagination.current ?? 1;
        setCurrentPage(currPage);
        const params: IPaginatedAnswerLogsParams = {
            ...queryParams,
            page_id: currPage - previousPageNumber === 1 ? nextPageToken.toString() : undefined,
            page_no: currPage - previousPageNumber !== 1 ? currPage - 1 : undefined,
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
            if (selectedFilters.accepted_only) {
                queryParams.accepted_only = true
            }
            const params: IPaginatedAnswerLogsParams = {
                ...queryParams,
                page_id: currentPage - previousPageNumber === 1 ? nextPageToken.toString() : undefined,
                page_no: currentPage - previousPageNumber !== 1 ? currentPage - 1 : undefined,
                desc: true,
            };
            const result = await getPaginatedAnswerLogs(questId, session?.accessToken, params) as IPaginatedAnswerLogs;
            setLogsContent(result?.answer_logs);
            setNextPageToken(result?.next_page_token);
            setTotalPages(result?.total_pages);
        };

        filterLogs().catch(err => {
            throw err;
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFilters]);

    const getOptions = () => {
        const groups = (contextData?.task_groups ?? []).map(item => ({
            value: `${item?.name}_${item?.id}`,
            label: item?.name,
        }));
        const tasks = (contextData?.task_groups ?? []).map(item =>
            (item?.tasks ?? [])?.map(task => ({
                value: `${task.name}_${task.id}`,
                label: task.name,
        }))).flat();
        const teams = (contextData?.teams ?? []).map(item => ({
            value: `${item?.name}_${item.id}`,
            label: item?.name,
        }));
        const users = (contextData?.teams ?? []).map(item =>
            (item?.members ?? []).map(member => ({
                value: `${member?.username}_${member?.id}`,
                label: member?.username,
            }))).flat();
        return {
            groups,
            tasks,
            teams,
            users,
            accepted_only: selectedFilters.accepted_only ?? false
        };
    };

    const filterSelectOptions = getOptions();

    const columns: TableProps<IAnswerLog>['columns'] = [
        {
            title: 'Время',
            dataIndex: 'answer_time',
            key: 'answer_time',
            render: (time: string) => new Date(time).toLocaleString('ru-RU').replace(',', ''),
            width: '152px'
        },
        {
            title: 'Группа',
            dataIndex: 'task_group',
            key: 'task_group',
            render: (_, record) =>
                <Tooltip title={record.task_group} placement='topLeft'>
                    {record.task_group}
                </Tooltip>,
            width: '208px'
        },
        {
            title: 'Задача',
            dataIndex: 'task',
            key: 'task',
            render: (task: string) =>
                <Tooltip title={task} placement='topLeft'>
                    <span>{task}</span>
                </Tooltip>,
            width: '208px'
        },
        {
            title: 'Команда',
            dataIndex: 'team',
            key: 'team',
            render: (_, record) =>
                <Tooltip title={record.team} placement='topLeft'>
                    {record.team}
                </Tooltip>,
            width: '208px'
        },
        {
            title: 'Пользователь',
            dataIndex: 'user',
            key: 'user',
            render: (_, record) =>
                <Tooltip title={record.user ?? '—'} placement='topLeft'>
                    {record.user ?? '—'}
                </Tooltip>,
            width: '208px'
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
        <ConfigProvider renderEmpty={renderEmpty}>
            {!isInfoAlertHidden && <InfoAlert setIsInfoAlertHidden={setIsInfoAlertHidden} />}
            <Filters
                options={filterSelectOptions}
                setSelectedFilters={setSelectedFilters}
            />
            <Table<IAnswerLog>
                columns={columns}
                dataSource={logsContent}
                rowKey={(log) => log.answer_time}
                pagination={{ total: LOGS_PAGE_SIZE * totalPages, pageSize: LOGS_PAGE_SIZE, showSizeChanger: false }}
                onChange={onPaginationChange}
                scroll={{ x: 1186 }}
                className='logs-table__table'
            />
        </ConfigProvider>
    );
}
