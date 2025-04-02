import { Checkbox, Select } from 'antd';
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
    accepted_only: boolean;
}

export interface SelectedFiltersState {
    group?: string;
    task?: string;
    team?: string;
    user?: string;
    accepted_only?: boolean;
}

interface FiltersProps {
    options: FilterSelectOptions;
    setSelectedFilters: Dispatch<SetStateAction<SelectedFiltersState>>;
}

export default function Filters({ options, setSelectedFilters }: FiltersProps) {
    const onFilterChange = (filterName: keyof SelectedFiltersState, value: string | boolean) => {
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
                showSearch
                autoClearSearchValue
                optionFilterProp={'label'}
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={options?.groups}
                className='answer-logs__filter'
                onChange={(value: string) => onFilterChange('group', value)}
            />
            <Select
                placeholder='Задача'
                allowClear
                showSearch
                autoClearSearchValue
                optionFilterProp={'label'}
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={options?.tasks}
                className='answer-logs__filter'
                onChange={(value: string) => onFilterChange('task', value)}
            />
            <Select
                placeholder='Команда'
                allowClear
                showSearch
                autoClearSearchValue
                optionFilterProp={'label'}
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={options?.teams}
                className='answer-logs__filter'
                onChange={(value: string) => onFilterChange('team', value)}
            />
            <Select
                placeholder='Пользователь'
                allowClear
                showSearch
                autoClearSearchValue
                optionFilterProp={'label'}
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={options?.users}
                className='answer-logs__filter'
                onChange={(value: string) => onFilterChange('user', value)}
            />
            <Checkbox
                checked={options?.accepted_only}
                className='answer-logs__filter'
                onChange={(e) => onFilterChange('accepted_only', e.target.checked)}
            >
                Только правильные
            </Checkbox>
        </div>
    )
}
