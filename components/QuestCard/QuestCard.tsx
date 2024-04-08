import { Card } from 'antd';
import Image from 'next/image';

import './QuestCard.css';
import {
    getQuestStatusLabel, getStartDateText,
    QuestHeaderProps,
} from '@/components/Quest/Quest.helpers';
import Link from 'next/link';

export default function QuestCard({props} : {props?: QuestHeaderProps}) {
    if (!props) {
        return null;
    }

    const {
        id,
        name,
        start_time: startTime,
        registration_deadline: registrationDeadline,
        media_link: mediaLink,
        status
    } = props;
    const registrationDate = new Date(registrationDeadline);
    const startDate = new Date(startTime);
    const startDateLabel = getStartDateText(startDate);

    return (
        <Link href={`/quest/${id}`} className={'quest-card__anchor'} prefetch={false}>
            <Card
                className={'quest-card quest-card__mode_preview'}
                cover={<Image
                    src={mediaLink ?? `https://source.unsplash.com/random/${name}`}
                    fill sizes={'100% 128px'} style={{ objectFit: 'cover' }} alt={'quest avatar'} placeholder={'empty'}/>}
            >
                <h3 className={'quest-card__name'}>{name}</h3>
                <p className={'quest-card__start'}>{startDateLabel}</p>
                <div className={'status__wrapper'}>
                    <svg className={'quest-card__status_registration'} xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="none" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="4" fill="black" />
                    </svg>
                    {getQuestStatusLabel(registrationDate, status)}
                </div>
            </Card>
        </Link>
    );
}
