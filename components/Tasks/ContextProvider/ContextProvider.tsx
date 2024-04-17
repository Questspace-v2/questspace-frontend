'use client'

import React, { createContext, useContext, useState } from 'react';
import { ITaskGroupsCreateRequest } from '@/app/types/quest-interfaces';

export interface IContext {
    data: ITaskGroupsCreateRequest,
    updater: (value: ITaskGroupsCreateRequest) => void
}

const TasksContext = createContext<IContext | null>(null);

export default function ContextProvider({children}: {children: React.ReactNode}) {
    const [state, setState] = useState<ITaskGroupsCreateRequest>(
        {task_groups: []}
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