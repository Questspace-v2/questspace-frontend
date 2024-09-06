import {BACKEND_URL} from '@/app/api/client/constants';
import {TaskAnswerDto} from '@/app/api/dto/play-mode-dto/task-answer.dto';
import {TaskAnswerResponseDto} from '@/app/api/dto/play-mode-dto/task-answer-response.dto';
import {TakeHintDto} from '@/app/api/dto/play-mode-dto/take-hint.dto';
import {TakeHintResponseDto} from '@/app/api/dto/play-mode-dto/take-hint-response.dto';
import {TaskGroupsPlayModeResponseDto} from '@/app/api/dto/play-mode-dto/task-groups-play-mode-response.dto';
import {AdminLeaderboardResponseDto} from '@/app/api/dto/play-mode-dto/admin-leaderboard-response.dto';

class PlayModeService {
    private readonly baseQuestUrl = `${BACKEND_URL}/quest`;

    public async answerTask(questId: string, data: TaskAnswerDto, accessToken?: string): Promise<TaskAnswerResponseDto> {
        const url = `${this.baseQuestUrl}/${questId}/answer`;
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: accessToken ? {
                Authorization: `Bearer ${accessToken}`,
            } : {},
        }).then(response => response.json())
            .then(response => response as TaskAnswerResponseDto);
    }

    public async takeHint(questId: string, data: TakeHintDto, accessToken?: string): Promise<TakeHintResponseDto> {
        const url = `${this.baseQuestUrl}/${questId}/hint`;
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: accessToken ? {
                Authorization: `Bearer ${accessToken}`,
            } : {},
        }).then(response => response.json())
            .then(response => response as TakeHintResponseDto);
    }

    public async getTaskGroupsPlayMode(questId: string, accessToken?: string): Promise<TaskGroupsPlayModeResponseDto> {
        const url = `${this.baseQuestUrl}/${questId}/play`;
        return fetch(url, {
            headers: accessToken ? {
                Authorization: `Bearer ${accessToken}`,
            } : {},
        }).then(response => response.json())
            .then(response => response as TaskGroupsPlayModeResponseDto);
    }

    public async getAdminLeaderboard(questId: string, accessToken?: string): Promise<AdminLeaderboardResponseDto> {
        const url = `${this.baseQuestUrl}/${questId}/table`;
        return fetch(url, {
            headers: accessToken ? {
                Authorization: `Bearer ${accessToken}`,
            } : {},
        }).then(response => response.json())
            .then(response => response as AdminLeaderboardResponseDto);
    }
}

export default PlayModeService;