import { TasksMode } from '@/components/Tasks/Tasks.helpers';
import TaskGroup from '@/components/Tasks/TaskGroup/TaskGroup';
import {TaskGroupDto} from '@/app/api/dto/task-groups-dto/task-group.dto';

interface TasksProps {
    readonly mode: TasksMode;
    readonly props: readonly TaskGroupDto[];
    readonly questId: string;
}

export default function Tasks({mode, props, questId} : TasksProps) {
    return (
        <>
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
            {props?.map((taskGroup) => <TaskGroup mode={mode} props={taskGroup} key={taskGroup.pub_time} questId={questId}/>)}
        </>
    );
}
