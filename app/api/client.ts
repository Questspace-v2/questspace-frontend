import API_URL from './settings';
import { BadRequestError, HttpError, NotFoundError, TooManyRequestsError } from './custom-errors';

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

class Client {
    private readonly apiUrl: string;

    constructor() {
        this.apiUrl = API_URL;
    }

    async invoke<TRequest, TResponse>(
        endpoint = '/',
        method: HttpMethod = HttpMethod.GET,
        data: TRequest = {} as TRequest,
        headers: Record<string, string> = {}
    ): Promise<TResponse> {
        if (!endpoint || !endpoint.startsWith('/')) {
            endpoint = `/${endpoint}`;
        }

        const url = `${this.apiUrl}${endpoint}`;

        return fetch(url, this.buildInit(method, data, headers))
            .then((resp) => {
                if (resp.ok) {
                    return resp.json();
                }

                switch (resp.status) {
                    case 400:
                        throw new BadRequestError();
                    case 404:
                        throw new NotFoundError();
                    case 429:
                        throw new TooManyRequestsError();
                    default:
                        throw new HttpError(resp.status);
                }

            })
            .catch(reason => console.error(`Error while fetching: ${reason}`));
    }

    private buildInit<TRequest>(method: HttpMethod, data: TRequest, headers: Record<string, string>): RequestInit {
        const baseInit: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        };

        if (method !== HttpMethod.GET) {
            baseInit.body = JSON.stringify(data);
        }

        return baseInit;
    }
}

const client = new Client();

export default client;