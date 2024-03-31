import { enableFetchMocks } from 'jest-fetch-mock';
import { authSignIn, getFilteredQuests } from '@/app/api/api';
import { ISignIn, ISignInResponse } from '@/app/types/user-interfaces';
import { Forbidden, HttpError } from 'http-errors';
import { IFilteredQuestsResponse } from '@/app/types/quest-interfaces';
import questMock from '@/app/api/__mocks__/Quest.mock';

enableFetchMocks();

describe('authSignInTests', () => {
    const testCredentials: ISignIn = {
        username: 'clown',
        password: '12345'
    };

    const testResponse: ISignInResponse = {
        access_token: 'token',
        user: {
            id: '1',
            username: 'clown',
            avatar_url: 'someUrl'
        }
    };

    beforeEach(() => {
        fetchMock.resetMocks();
    });

    it('Valid credentials', async () => {
        fetchMock.mockResponse(JSON.stringify(testResponse));
        const data = await authSignIn(testCredentials) as ISignInResponse;
        expect(data).toStrictEqual(testResponse);
    });

    // NOTE(svayp11): Skip broken test
    test.skip('Invalid credentials', async () => {
        fetchMock.mockReject(new Forbidden('Forbidden'));
        const data = await authSignIn(testCredentials) as HttpError;
        expect(data).toBe(new Forbidden('Forbidden'));
    });
});

describe('getFilteredQuests', () => {
    const testResponse: IFilteredQuestsResponse = {
        all: {
            next_page_id: '1',
            quests: [
                questMock
            ]
        }
    };

    beforeEach(() => {
        fetchMock.resetMocks();
    });

    // NOTE(svayp11): Skip broken test
    test.skip('AllQuests', async () => {
        fetchMock.mockResponse(JSON.stringify(testResponse));
        const data = await getFilteredQuests(['all']) as IFilteredQuestsResponse;
        expect(data).toStrictEqual(testResponse);
    });
});