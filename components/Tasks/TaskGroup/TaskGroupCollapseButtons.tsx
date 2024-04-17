'use client';

import { Button, ConfigProvider } from 'antd';
import { blueOutlinedButton, redOutlinedButton } from '@/lib/theme/themeConfig';
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useTasksContext } from '@/components/Tasks/ContextProvider/ContextProvider';

export default function TaskGroupCollapseButtons() {
    const {data: contextData, updater: setContextData} = useTasksContext()!;

    const handleAddTask = () => {
        setContextData({task_groups: contextData.task_groups}); // Тут нужно узнать, к какой группе добавляем таск
    }

    return (
        <div className={'task-group__collapse-buttons'}>
            <ConfigProvider theme={blueOutlinedButton}>
                <Button><EditOutlined />Изменить название</Button>
                <Button onClick={handleAddTask}><CopyOutlined />Добавить задачу</Button>
            </ConfigProvider>
            <ConfigProvider theme={redOutlinedButton}>
                <Button><DeleteOutlined />Удалить раздел</Button>
            </ConfigProvider>
        </div>
    );
}