import {QuestDto} from '@/app/api/dto/quest-dto/quest.dto';
import {TeamDto} from '@/app/api/dto/team-dto/team.dto';
import {FinalLeaderboardDto} from '@/app/api/dto/quest-dto/final-leaderboard.dto';

export interface QuestDetailsDto {
    quest: QuestDto;
    team?: TeamDto;
    leaderboard?: FinalLeaderboardDto;
}