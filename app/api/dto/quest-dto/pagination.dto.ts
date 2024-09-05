export interface PaginationDto {
    readonly fields: readonly string[];
    readonly page_size: string;
    page_id?: string;
}