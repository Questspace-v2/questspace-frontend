import { Collapse, CollapseProps } from 'antd';
import Task from '@/components/Tasks/Task/Task';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { getTaskExtra, TasksMode } from '@/components/Tasks/Tasks.helpers';
import { ITaskGroup } from '@/app/types/quest-interfaces';
import { uid } from '@/lib/utils/utils';
import TaskGroupExtra from '@/components/Tasks/TaskGroup/TaskGroupExtra';

import './TaskGroup.css';

export default function TaskGroup({mode, props} : {mode: TasksMode, props: ITaskGroup}) {
    const { name, tasks } = props;
    const collapseExtra = <TaskGroupExtra edit={mode === TasksMode.EDIT}/>;

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: name,
            children:
                <>
                    {(tasks.map((task) =>
                        <div className={'task-group__task'} key={uid()}>
                            <Task props={task} mode={mode} />
                            {getTaskExtra(mode === TasksMode.EDIT, false)}
                        </div>
                    ))}
                </>,
            headerClass: 'task-group__name roboto-flex-header',
            extra: collapseExtra,
        },
    ];

    return (
        <ContentWrapper className={'task-group__content-wrapper'}>
            <Collapse ghost items={items} className={'task-group__collapse'} collapsible={'header'}/>
        </ContentWrapper>
    );
}
