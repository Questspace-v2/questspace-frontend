'use client';

import { useTasksContext } from '@/components/Tasks/ContextProvider/ContextProvider';
import Logs from '@/components/QuestAdmin/Logs/Logs';
import { IPaginatedAnswerLogs } from '@/app/types/quest-interfaces';
import React, { useState, useEffect } from 'react';
import QuestAdminTabs from '@/components/QuestAdmin/QuestAdminTabs';
import { ITeam } from '@/app/types/user-interfaces';

interface LogsTabClientProps {
  initialTeams: ITeam[];
  initialLogs: IPaginatedAnswerLogs;
  questId: string;
}

export default function LogsTabClient({ initialTeams, initialLogs, questId }: LogsTabClientProps) {
    const { data: contextData, updater: setContextData } = useTasksContext()!;
    const [isInfoAlertHidden, setIsInfoAlertHidden] = useState(false);

    // Инициализация состояний предзагруженными данными
    useEffect(() => {
        setContextData(prevState => ({
            ...prevState,
            teams: initialTeams,
            quest: { ...prevState.quest, id: questId }
        }));
    }, [initialTeams, questId, setContextData]);

    return (
        <QuestAdminTabs>
            <Logs
                questId={contextData.quest.id}
                paginatedLogs={initialLogs}
                isInfoAlertHidden={isInfoAlertHidden}
                setIsInfoAlertHidden={setIsInfoAlertHidden}
            />
        </QuestAdminTabs>
    );
}