import { TasksMode } from '@/components/Tasks/Tasks.helpers';
import TaskGroup from '@/components/Tasks/TaskGroup/TaskGroup';
import { ITaskGroup } from '@/app/types/quest-interfaces';
import { uid } from '@/lib/utils/utils';

export default function Tasks({mode, props} : {mode: TasksMode, props: ITaskGroup[]}) {
    return (
        <>
            {props.map((taskGroup) => <TaskGroup mode={mode} props={taskGroup} key={uid()}/>)}
        </>
    );
}
