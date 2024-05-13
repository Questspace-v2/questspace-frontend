import TaskEditButtons from "@/components/Tasks/Task/EditTask/TaskEditButtons/TaskEditButtons";
import {ITask} from "@/app/types/quest-interfaces";

export const enum TasksMode {
    EDIT = 'edit',
    PLAY = 'play'
}

export const getTaskExtra = (edit: boolean, mobile526: boolean, taskGroupName: string, task: ITask) => {
    if (edit) {
        return (
            <TaskEditButtons mobile526={mobile526} taskGroupName={taskGroupName} task={task}/>
        );
    }

    return null;
}
