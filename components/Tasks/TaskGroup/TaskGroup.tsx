import { Collapse, CollapseProps } from 'antd';
import Task from '@/components/Tasks/Task/Task';
import { taskGroupMock } from '@/app/api/__mocks__/Task.mock';

import './TaskGroup.css';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';

export default function TaskGroup({mode} : {mode: 'play' | 'edit'}) {
    const {name} = taskGroupMock;
    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: name,
            children: <Task mode={mode}/>,
            headerClass: 'task-group__name roboto-flex-header'
        },
    ];

    return (
        <ContentWrapper className={'task-group__content-wrapper'}>
            <Collapse ghost items={items} className={'task-group__collapse'}/>
        </ContentWrapper>
    );
}
