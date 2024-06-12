'use client'

import React, { createContext, useContext, useState } from 'react';
import {ITaskGroup, ITaskGroupsCreateRequest} from '@/app/types/quest-interfaces';

export interface IContext {
    data: ITaskGroupsCreateRequest,
    updater: React.Dispatch<React.SetStateAction<ITaskGroupsCreateRequest>>
}

const TasksContext = createContext<IContext | null>(null);

export default function ContextProvider({children, taskGroups}: {children: React.ReactNode, taskGroups: ITaskGroup[]}) {
    const [state, setState] = useState<ITaskGroupsCreateRequest>(
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