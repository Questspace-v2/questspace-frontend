import { Select } from 'antd';
import { Dispatch, SetStateAction } from 'react';

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

export interface SelectedFiltersState {
    group?: string;
    task?: string;
    team?: string;
    user?: string;
}

interface FiltersProps {
    options: FilterSelectOptions;
    setSelectedFilters: Dispatch<SetStateAction<SelectedFiltersState>>;
}

export default function Filters({ options, setSelectedFilters }: FiltersProps) {
    const onFilterChange = (filterName: keyof SelectedFiltersState, value: string) => {
        setSelectedFilters(prevState => ({
            ...prevState,
            [filterName]: value,
        }));
    };

    return (
        <div className='answer-logs__filters'>
            <span className='answer-logs__filters-title'>Фильтры</span>
            <Select
                placeholder='Группа'
                allowClear
                options={options.groups}
                className='answer-logs__filter'
                onChange={(value: string) => onFilterChange('group', value)}
            />
            <Select
                placeholder='Задание'
                allowClear
                options={options.tasks}
                className='answer-logs__filter'
                onChange={(value: string) => onFilterChange('task', value)}
            />
            <Select
                placeholder='Команда'
                allowClear
                options={options.teams}
                className='answer-logs__filter'
                onChange={(value: string) => onFilterChange('team', value)}
            />
            <Select
                placeholder='Пользователь'
                allowClear
                options={options.users}
                className='answer-logs__filter'
                onChange={(value: string) => onFilterChange('user', value)}
            />
        </div>
    )
}
