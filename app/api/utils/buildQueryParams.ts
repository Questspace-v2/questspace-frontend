import {PaginationDto} from '@/app/api/dto/quest-dto/pagination.dto';

function buildParams(data: PaginationDto) {
    const params = new URLSearchParams()
    console.log(data);
    const clearedData = JSON.parse(JSON.stringify(data)) as PaginationDto;

    Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((item: string) => params.append(key, item));
        } else {
            params.append(key, String(value));
        }
    })

    return params.toString()
}

export default buildParams;