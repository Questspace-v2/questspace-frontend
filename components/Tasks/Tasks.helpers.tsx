import TaskEditButtons from "@/components/Tasks/Task/EditTask/TaskEditButtons/TaskEditButtons";
import { ITask, ITaskGroup } from '@/app/types/quest-interfaces';

export const enum TasksMode {
    EDIT = 'edit',
    PLAY = 'play'
}

export const getTaskExtra = (edit: boolean, mobile526: boolean, taskGroupProps: Pick<ITaskGroup, 'id' | 'pub_time' | 'name'>, task: ITask, questId: string) => {
    if (edit) {
        return (
            <TaskEditButtons
                questId={questId}
                mobile526={mobile526}
                taskGroupProps={taskGroupProps}
                task={task} key={task.pub_time}
            />
        );
    }

    return null;
}
