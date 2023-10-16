import API_URL from './settings';

enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

class Client {
    private apiUrl: string;

    constructor() {
        this.apiUrl = API_URL;
    }

    async invoke(
        endpoint = '/',
        method: HttpMethod = HttpMethod.GET,
        data: Record<string, string> = {},
        headers: Record<string, string> = {}
    ) {
        if (!endpoint || endpoint.charAt(0) !== '/') {
            endpoint = `/${endpoint}`;
        }

        const url = (method === HttpMethod.GET && Object.keys(data).length > 0)
            ? this.formatQueryString(endpoint, data)
            : `${this.apiUrl}${endpoint}`;

        try {
            const response = await fetch(url, this.buildInit(method, data, headers));
            if (response.ok) {
                return await response.json();
            } else {
                console.error(`Request failed with status ${response.status}`);
            }
        } catch(error) {
            console.error(error);
        }

    }

    buildInit(method: HttpMethod, data: Record<string, string>, headers: Record<string, string>): RequestInit {
        const baseInit: RequestInit = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            redirect: 'follow',
        };

        if (method !== HttpMethod.GET) {
            baseInit.body = JSON.stringify(data);
        }

        return baseInit;

    }

    formatQueryString(endpoint: string, data: Record<string, string>): string {
        const querystringParams: string[] = [];
        for (const [key, value] of Object.entries(data)) {
            querystringParams.push(`${key}=${value}`);
        }

        return `${this.apiUrl}${endpoint}?${querystringParams.join('&')}`;
    }
}

const client = new Client();

export default client;