export interface TaskResult {
    readonly score: number;
}

export interface AdminLeaderboardResultDto {
    readonly penalty: number;
    readonly taskResults: readonly TaskResult[];
    readonly taskScore: number;
    readonly teamID: string;
    readonly teamName: string;
    readonly totalScore: number;
}