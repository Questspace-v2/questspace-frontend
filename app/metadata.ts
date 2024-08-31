import { Metadata } from 'next';
import { FRONTEND_URL } from '@/app/api/client/constants';

const mainMetadata: Metadata = {
    metadataBase: new URL(FRONTEND_URL),
    keywords: ['Квестспейс', 'Квест спейс', 'Questspace', 'Quest space', 'Квест', 'Матмех', 'Мат-мех'],
    title: {
        default: 'Квестспейс',
        template: `%s | Квестспейс`
    },
    description: 'Веб-приложение для организации и проведения квестов',
    openGraph: {
        description: 'Веб-приложение для организации и проведения квестов',
        images: ['']
    },
};

export default mainMetadata;
