import { Collapse, CollapseProps } from 'antd';
import Task from '@/components/Tasks/Task/Task';
import { taskGroupMock, taskMock1, taskMock2 } from '@/app/api/__mocks__/Task.mock';

import './TaskGroup.css';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';

const tasks = [taskMock2, taskMock1];

export default function TaskGroup({mode} : {mode: 'play' | 'edit'}) {
    const {name} = taskGroupMock;
    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: name,
            children: <><Task props={taskMock1} mode={mode}/><Task props={taskMock2} mode={mode}/></>,
            headerClass: 'task-group__name roboto-flex-header'
        },
    ];

    return (
        <ContentWrapper className={'task-group__content-wrapper'}>
            <Collapse ghost items={items} className={'task-group__collapse'}/>
        </ContentWrapper>
    );
}
