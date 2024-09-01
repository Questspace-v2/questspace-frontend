import { Metadata } from 'next';
import { FRONTEND_URL } from '@/app/api/client/constants';

const mainMetadata: Metadata = {
    metadataBase: new URL(FRONTEND_URL),
    keywords: ['Квестспейс', 'Квест спейс', 'Questspace', 'Quest space', 'Квест', 'Матмех', 'Мат-мех'],
    title: {
        default: 'Квестспейс',
        template: `%s | Квестспейс`
    },
    description: 'Квестспейс — движок для городских квестов. Проводите квесты в городе, а сервис возьмет на себя прием ответов и подсчет баллов.',
    openGraph: {
        description: 'Квестспейс — движок для городских квестов. Проводите квесты в городе, а сервис возьмет на себя прием ответов и подсчет баллов.',
        images: ['']
    },
};

export default mainMetadata;
