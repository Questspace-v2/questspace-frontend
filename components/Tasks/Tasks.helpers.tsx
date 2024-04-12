import { Button, ConfigProvider } from 'antd';
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { blueOutlinedButton, redOutlinedButton } from '@/lib/theme/themeConfig';

export const enum TasksMode {
    EDIT = 'edit',
    PLAY = 'play'
}

export const getTaskGroupExtra = (edit: boolean) => {
    if (edit) {
        return (
            <div className={'task-group__collapse-buttons'}>
                <ConfigProvider theme={blueOutlinedButton}>
                    <Button><EditOutlined/>Изменить название</Button>
                    <Button><CopyOutlined/>Добавить задачу</Button>
                </ConfigProvider>
                <ConfigProvider theme={redOutlinedButton}>
                    <Button><DeleteOutlined/>Удалить раздел</Button>
                </ConfigProvider>
            </div>
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
