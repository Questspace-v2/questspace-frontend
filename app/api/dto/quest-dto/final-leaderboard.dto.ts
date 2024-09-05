export interface FinalLeaderboardRow {
    readonly score: number,
    readonly team_id: string,
    readonly team_name: string,
}

export interface FinalLeaderboardDto {
    readonly rows: readonly FinalLeaderboardRow[];
}