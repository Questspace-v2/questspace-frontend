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
            <span>Фильтры</span>
            <Select
                placeholder='Группа'
                options={options.groups}
            />
            <Select
                placeholder='Задание'
                options={options.tasks}
            />
            <Select
                placeholder='Команда'
                options={options.teams}
            />
            <Select
                placeholder='Пользователь'
                options={options.users}
            />
        </div>
    )
}