export const BACKEND_URL = 'https://api.questspace.fun';
export const FRONTEND_URL = process.env.NODE_ENV === 'development' ? 'https://test.questspace.fun:3000' : 'https://questspace.fun';
export const ALLOWED_USERS_ID = [
    '1e6984c6-515a-4342-a8d8-de098e621e7c',
    '85ce207f-0688-423a-8d7e-6f25b7d78e95',
    '31ba03d1-39e1-4d6a-b8a8-9dbf6cc6bed7',
    'c465da31-dea8-4602-8581-0a7b4524909f'
];
export const RELEASED_FEATURE = process.env.NODE_ENV === 'development';
