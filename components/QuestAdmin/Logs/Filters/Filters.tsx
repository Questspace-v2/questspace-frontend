import { Select } from 'antd';

export interface Option {
    value: string;
    label: string;
}

export interface FilterSelectOptions {
    groups: Option[];
    tasks: Option[];
    teams: Option[];
    users: Option[];
}

interface FiltersProps {
    options: FilterSelectOptions;
}

export default function Filters({ options }: FiltersProps) {
    return (
        <div className='answer-logs__filters'>
            <span className='answer-logs__filters-title'>Фильтры</span>
            <Select
                placeholder='Группа'
                options={options.groups}
                className='answer-logs__filter'
            />
            <Select
                placeholder='Задание'
                options={options.tasks}
                className='answer-logs__filter'
            />
            <Select
                placeholder='Команда'
                options={options.teams}
                className='answer-logs__filter'
            />
            <Select
                placeholder='Пользователь'
                options={options.users}
                className='answer-logs__filter'
            />
        </div>
    )
}