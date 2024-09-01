import {QuestDto} from '@/app/api/dto/questDto/quest.dto';
import {TeamDto} from '@/app/api/dto/teamDto/team.dto';
import {FinalLeaderboardDto} from '@/app/api/dto/questDto/final-leaderboard.dto';

export interface QuestDetailsDto {
    quest: QuestDto;
    team?: TeamDto;
    leaderboard?: FinalLeaderboardDto;
}