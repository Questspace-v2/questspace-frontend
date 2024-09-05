import TaskEditButtons from '@/components/Tasks/Task/EditTask/TaskEditButtons/TaskEditButtons';
import {TaskDto} from '@/app/api/dto/task-groups-dto/task.dto';

export const enum TasksMode {
    EDIT = 'edit',
    PLAY = 'play'
}

export const getTaskExtra = (
    edit: boolean,
    mobile526: boolean,
    taskGroupName: string,
    task: TaskDto,
    questId: string
) => {
    if (edit) {
        return (
            <TaskEditButtons
                questId={questId}
                mobile526={mobile526}
                taskGroupName={taskGroupName}
                task={task} key={task.pub_time}
            />
        );
    }

    return null;
}
