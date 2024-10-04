import { TasksMode } from '@/components/Tasks/Task/Task.helpers';
import TaskGroup from '@/components/Tasks/TaskGroup/TaskGroup';
import { IQuestTaskGroups } from '@/app/types/quest-interfaces';
import Brief from '@/components/Tasks/Brief/Brief';

export default function Tasks({mode, props} : {mode: TasksMode, props: IQuestTaskGroups}) {
    return (
        <>
            <Brief mode={mode} />
            {props.task_groups?.map((taskGroup) => <TaskGroup mode={mode} props={taskGroup} key={taskGroup.pub_time} questId={props.quest.id}/>)}
        </>
    );
}
