export interface TaskAnswerResponseDto {
    readonly accepted: boolean;
    readonly score: number;
    readonly text: string;
}