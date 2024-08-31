import { useState } from 'react';
import { Card } from 'antd';
import Image from 'next/image';
import {
    getQuestStatusLabel, getStartDateText,
    QuestHeaderProps,
} from '@/components/Quest/Quest.helpers';
import Link from 'next/link';


export default function QuestCard({props} : {props?: QuestHeaderProps}) {
    const [src, setSrc] = useState<string>(props?.media_link ?? 'https://storage.yandexcloud.net/questspace-img/assets/error-src.png');
    if (!props) {
        return null;
    }

    const {
        id,
        name,
        start_time: startTime,
        registration_deadline: registrationDeadline,
        status
    } = props;

    const registrationDate = new Date(registrationDeadline);
    const startDate = new Date(startTime);
    const startDateLabel = getStartDateText(startDate);

    return (
        <Link href={`/quest/${id}`} className={'quest-card__anchor'} prefetch={false} tabIndex={0}>
            <Card
                className={'quest-card quest-card__mode_preview'}
                cover={<Image
                    src={src}
                    fill
                    sizes={'100% 128px'}
                    style={{ objectFit: 'cover' }}
                    alt={''}
                    placeholder={'empty'}
                    priority
                    onError={() => setSrc('https://storage.yandexcloud.net/questspace-img/assets/error-src.png')}
                />}
            >
                <h3 className={'quest-card__name'}>{name}</h3>
                <p className={'quest-card__start'}>{startDateLabel}</p>
                <div className={'status__wrapper'}>
                    {getQuestStatusLabel(registrationDate, status)}
                </div>
            </Card>
        </Link>
    );
}
