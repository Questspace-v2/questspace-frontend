import {BACKEND_URL} from '@/app/api/client/constants';
import {PaginationDto} from '@/app/api/dto/questDto/pagination.dto';
import {CreateQuestDto} from '@/app/api/dto/questDto/create-quest.dto';
import {QuestDto} from '@/app/api/dto/questDto/quest.dto';
import {UpdateQuestDto} from '@/app/api/dto/questDto/update-quest.dto';
import {QuestDetailsDto} from '@/app/api/dto/questDto/quest-details.dto';
import buildParams from '@/app/api/utils/buildQueryParams';
import {FilteredQuestsResponseDto} from '@/app/api/dto/questDto/filtered-quests-response.dto';

class QuestService {
    private readonly baseQuestUrl = `${BACKEND_URL}/quest`;

    public async getAllQuests(queryParams: PaginationDto, accessToken?: string) {
        const queryString = buildParams(queryParams);
        const url = `${this.baseQuestUrl}?${queryString}`;
        return fetch(url, {
            headers: accessToken ? {
                Authorization: `Bearer ${accessToken}`,
            } : {},
        }).then(response => response.json())
            .then(response => response as FilteredQuestsResponseDto);
    }

    public async createQuest(data: CreateQuestDto, accessToken: string): Promise<QuestDto> {
        return fetch(this.baseQuestUrl, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }).then(response => response.json())
            .then(response => response as QuestDto);
    }

    public async getQuestById(id: string, accessToken?: string): Promise<QuestDetailsDto> {
        const url = `${this.baseQuestUrl}/${id}`;
        return fetch(url, {
            headers: accessToken ? {
                Authorization: `Bearer ${accessToken}`,
            } : {},
        }).then(response => response.json())
            .then(response => response as QuestDetailsDto);
    }

    public async updateQuest(id: string, data: UpdateQuestDto, accessToken: string): Promise<QuestDto> {
        const url = `${this.baseQuestUrl}/${id}`;
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }).then(response => response.json())
            .then(response => response as QuestDto);
    }

    public async deleteQuest(id: string, accessToken: string) {
        const url = `${this.baseQuestUrl}/${id}`;
        return fetch(url, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }
}

export default QuestService;