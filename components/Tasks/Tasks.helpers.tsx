import TaskEditButtons from "@/components/Tasks/Task/EditTask/TaskEditButtons/TaskEditButtons";

export const enum TasksMode {
    EDIT = 'edit',
    PLAY = 'play'
}

export const getTaskExtra = (edit: boolean, mobile526: boolean, taskGroupName: string) => {
    if (edit) {
        return (
            <TaskEditButtons mobile526={mobile526} taskGroupName={taskGroupName} />
        );
    }

    return null;
}
