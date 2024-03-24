import client from '@/app/api/client/client';

test('Valid credentials', async () => {
    const expectedResult = {
        access_token: "", // Беспокоюсь за безопасность, а моков пока нет
        user: {
            id: "",
            username: "squid",
            avatar_url: "https://api.dicebear.com/7.x/thumbs/svg?seed=52314045-e979-4d34-880b-b007c57dc574"
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = await client.handleServerRequest('/auth/sign-in', 'POST',
        {username: 'squid', password: '1234'});
    expect(user).toStrictEqual(expectedResult);
});