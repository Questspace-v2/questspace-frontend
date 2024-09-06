'use client'

import React, { createContext, useContext, useState } from 'react';
import {TaskGroupDto} from '@/app/api/dto/task-groups-dto/task-group.dto';
import {CreateTaskGroupsDto} from '@/app/api/dto/task-groups-dto/create-task-groups.dto';

export interface IContext {
    data: CreateTaskGroupsDto,
    updater: React.Dispatch<React.SetStateAction<CreateTaskGroupsDto>>
}

const TasksContext = createContext<IContext | null>(null);

export default function ContextProvider({children, taskGroups}: {children: React.ReactNode, taskGroups: TaskGroupDto[]}) {
    const [state, setState] = useState<CreateTaskGroupsDto>(
        {task_groups: taskGroups}
    );

    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <TasksContext.Provider value={{data: state, updater: setState}}>
            {children}
        </TasksContext.Provider>
    );
}

export function useTasksContext() {
    return useContext(TasksContext);
}