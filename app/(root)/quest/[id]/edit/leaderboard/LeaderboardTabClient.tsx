'use client';

import { useTasksContext } from '@/components/Tasks/ContextProvider/ContextProvider';
import Leaderboard from '@/components/QuestAdmin/Leaderboard/Leaderboard';
import { IAdminLeaderboardResponse } from '@/app/types/quest-interfaces';
import { finishQuest } from '@/app/api/api';
import { useSession } from 'next-auth/react';
import QuestAdminTabs from '@/components/QuestAdmin/QuestAdminTabs';
import { Button } from 'antd';
import classNames from 'classnames';
import { NotificationOutlined } from '@ant-design/icons';

interface LeaderboardTabClientProps {
  initialLeaderboard: IAdminLeaderboardResponse;
}

export default function LeaderboardTabClient({
  initialLeaderboard,

}: LeaderboardTabClientProps) {
    const { data: contextData } = useTasksContext()!;
    const { data: session } = useSession();

    const publishResults = () => finishQuest(contextData.quest.id, session?.accessToken);
    const publishResultsButton =
        <Button type={'primary'} className={classNames('quest-admin__extra-button', 'publish-results__button')} onClick={publishResults}>
            <NotificationOutlined />Опубликовать результаты
        </Button>;

    return (
        <QuestAdminTabs extraButton={publishResultsButton}>
            <Leaderboard
                questId={contextData.quest.id}
                teams={initialLeaderboard}
            />
        </QuestAdminTabs>
    );
}