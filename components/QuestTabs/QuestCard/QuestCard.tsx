import { useState } from 'react';
import { Card } from 'antd';
import Image from 'next/image';
import { getQuestStatusLabel } from '@/components/Quest/Quest.helpers';
import Link from 'next/link';
import { QuestHeaderProps } from '@/components/Quest/QuestHeader/QuestHeader';
import { getStartDateText } from '@/components/Quest/QuestHeader/QuestHeader.helpers';


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
                    width={1000}
                    height={500}
                    style={{ objectFit: 'cover', aspectRatio: '2/1', width: '100%', height: 'auto' }}
                    alt={''}
                    placeholder={'empty'}
                    priority
                    onError={() => setSrc('https://storage.yandexcloud.net/questspace-img/assets/error-src.png')}
                />}
                styles={{cover: {aspectRatio: '2/1'}}}
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
