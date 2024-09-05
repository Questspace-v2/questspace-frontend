export interface CreateQuestDto {
    readonly access: string,
    readonly description: string,
    readonly finish_time: string | Date,
    readonly max_team_cap: number,
    readonly media_link: string,
    readonly name: string,
    readonly registration_deadline: string | Date,
    readonly start_time: string | Date,
}