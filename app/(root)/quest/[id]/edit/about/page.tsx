'use client';

import EditQuest from '@/components/Quest/EditQuest/EditQuest';
import { useTasksContext } from '@/components/Tasks/ContextProvider/ContextProvider';
import QuestAdminTabs from '@/components/QuestAdmin/QuestAdminTabs';

export default function AboutTab() {
  const { data: contextData, updater: setContextData } = useTasksContext()!;

  return (
      <QuestAdminTabs>
        <EditQuest questData={contextData.quest} setContextData={setContextData} />
      </QuestAdminTabs>
  )
}