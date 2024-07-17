import { TasksMode } from '@/components/Tasks/Tasks.helpers';
import TaskGroup from '@/components/Tasks/TaskGroup/TaskGroup';
import { ITaskGroup } from '@/app/types/quest-interfaces';

export default function Tasks({mode, props, questId} : {mode: TasksMode, props: ITaskGroup[], questId: string}) {
    return (
        <>
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
            {props?.map((taskGroup) => <TaskGroup mode={mode} props={taskGroup} key={taskGroup.pub_time} questId={questId}/>)}
        </>
    );
}
