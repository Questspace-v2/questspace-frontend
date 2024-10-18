'use client'

import React, { createContext, useContext, useState } from 'react';
import { IQuestTaskGroups } from '@/app/types/quest-interfaces';

export interface IContext {
    data: IQuestTaskGroups,
    updater: React.Dispatch<React.SetStateAction<IQuestTaskGroups>>
}

const TasksContext = createContext<IContext | null>(null);

export default function ContextProvider({children, questData}: {
    children: React.ReactNode,
    questData: IQuestTaskGroups
}) {
    const [state, setState] = useState<IQuestTaskGroups>(questData);

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
