'use client';

import { useTasksContext } from '@/components/Tasks/ContextProvider/ContextProvider';
import QuestAdminTabs from '@/components/QuestAdmin/QuestAdminTabs';
import Teams from '@/components/QuestAdmin/Teams/Teams';
import React, { useEffect } from 'react';
import { ITeam } from '@/app/types/user-interfaces';

interface TeamsTabClientProps {
  initialTeams: ITeam[];
  questId: string;
}

export default function TeamsTabClient({ initialTeams, questId }: TeamsTabClientProps) {
  const { data: contextData, updater: setContextData } = useTasksContext()!;

  useEffect(() => {
    setContextData(prev => ({
      ...prev,
      teams: initialTeams,
      quest: { ...prev.quest, id: questId }
    }));
  }, [initialTeams, questId, setContextData]);

  return (
    <QuestAdminTabs>
      <Teams
        teams={initialTeams}
        questId={contextData.quest.id}
        registrationType={contextData.quest.registration_type}
      />
    </QuestAdminTabs>
  );
}