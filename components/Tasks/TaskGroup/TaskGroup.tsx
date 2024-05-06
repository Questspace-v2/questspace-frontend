import { Collapse, CollapseProps } from 'antd';
import Task from '@/components/Tasks/Task/Task';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { getTaskExtra, TasksMode } from '@/components/Tasks/Tasks.helpers';
import { ITaskGroup } from '@/app/types/quest-interfaces';
import { uid } from '@/lib/utils/utils';
import TaskGroupExtra from '@/components/Tasks/TaskGroup/TaskGroupExtra/TaskGroupExtra';

import './TaskGroup.css';

export default function TaskGroup({mode, props, questId} : {mode: TasksMode, props: ITaskGroup, questId: string}) {
    const { name, tasks } = props;
    const collapseExtra = <TaskGroupExtra edit={mode === TasksMode.EDIT} taskGroupName={name}/>;

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: name,
            children: tasks &&
                <>
                    {(tasks.map((task) =>
                        <div className={'task-group__task'} key={uid()}>
                            <Task props={task} mode={mode} questId={questId} taskGroupName={name}/>
                            {getTaskExtra(mode === TasksMode.EDIT, false, name, task)}
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
