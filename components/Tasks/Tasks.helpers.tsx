import { Button, ConfigProvider } from 'antd';
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { blueOutlinedButton, redOutlinedButton } from '@/lib/theme/themeConfig';
import TaskGroupCollapseButtons from '@/components/Tasks/TaskGroup/TaskGroupCollapseButtons';

export const enum TasksMode {
    EDIT = 'edit',
    PLAY = 'play'
}

export const getTaskGroupExtra = (edit: boolean) => {
    if (edit) {
        return (
            <TaskGroupCollapseButtons />
        );
    }
    return null;
}

export const getTaskExtra = (edit: boolean, mobile526: boolean) => {
    if (edit) {
        const classname = mobile526 ? 'task-extra_small' : 'task-extra_large';

        return (
            <div className={`task__edit-buttons ${classname}`}>
                <ConfigProvider theme={blueOutlinedButton}>
                    <Button><EditOutlined/>{!mobile526 && 'Редактировать задачу'}</Button>
                    <Button><CopyOutlined/>{!mobile526 && 'Создать копию задачи'}</Button>
                </ConfigProvider>
                <ConfigProvider theme={redOutlinedButton}>
                    <Button><DeleteOutlined/>{!mobile526 && 'Удалить задачу'}</Button>
                </ConfigProvider>
            </div>
        );
    }

    return null;
}
