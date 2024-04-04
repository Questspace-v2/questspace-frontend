import { Card } from 'antd';
import Image from 'next/image';

import './QuestCard.css';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { CalendarOutlined, HourglassOutlined } from '@ant-design/icons';
import { getQuestCardStatusButton, getTimeDiff, QuestHeaderProps } from '@/components/QuestCard/QuestCard.helpers';
import Link from 'next/link';

export default function QuestCard({mode, props} : {mode: 'full' | 'preview', props?: QuestHeaderProps}) {
    if (mode === 'preview' && props) {
        return (
            <Link href={`/quest/${props.quest.id}`} className={'quest-card__anchor'} prefetch={false}>
                <Card
                    className={'quest-card quest-card__mode_preview'}
                    cover={<Image
                        src={`https://source.unsplash.com/random/${props.quest.name}`}
                        fill sizes={'100% 128px'} style={{ objectFit: 'cover' }} alt={'quest avatar'} placeholder={'empty'}/>}
                >
                    <h3 className={'quest-card__name'}>{props.quest.name}</h3>
                    <p className={'quest-card__start'}>{(props.quest.start_time)?.toString()}</p>
                    <div className={'status__wrapper'}>
                        <svg className={'quest-card__status_registration'} xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="none" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="4" fill="black" />
                        </svg>
                        <p className={'quest-card__status quest-card__status_registration'}>Регистрация до {(props.quest.registration_deadline)?.toString()}</p>
                    </div>
                </Card>
            </Link>
        );
    }

    if (mode === 'full' && props) {
        const {
            name,
            start_time: startTime,
            creator ,
            registration_deadline: registrationDeadline,
            finish_time: finishTime,
            media_link: mediaLink,
            status
        } = props.quest;
        const {username, avatar_url: avatarUrl} = creator;
        const startDate = new Date(startTime);
        const registrationDate = new Date(registrationDeadline);
        const finishDate = new Date(finishTime);
        const timeDiffLabel = getTimeDiff(startDate, new Date(finishTime));
        const startDayMonth = startDate.toLocaleString('ru', {day: 'numeric', month: 'long'});
        const startHourMinute = startDate.toLocaleString('ru', {hour: 'numeric', minute: '2-digit'});
        const imageNode = <Image
            src={mediaLink}
            width={1000}
            height={1000}
            style={{ maxWidth: '100%', objectFit: 'contain', height: 'auto' }}
            alt={'quest avatar'}
        />;

        return (
            <ContentWrapper className={'quest-card__wrapper'}>
                <Card
                    className={'quest-card quest-card__mode_full'}
                    cover={imageNode}
                    bordered={false}
                >
                    <div className={'quest-card__text-content'}>
                        <h1 className={'quest-card__name roboto-flex-header responsive-header-h1'}>{name}</h1>
                        <div className={'quest-preview__information'}>
                            <div className={'information__block'}>
                                <Image src={avatarUrl} alt={'creator avatar'} priority draggable={false} width={16}
                                       height={16} style={{ borderRadius: '8px' }} />
                                <p>{username}</p>
                            </div>
                            <div className={'information__block'}>
                                <CalendarOutlined />
                                <p className={'quest-card__start'}>{`${startDayMonth} в ${startHourMinute}`}</p>
                            </div>
                            <div className={'information__block'}>
                                <HourglassOutlined />
                                <p className={'quest-card__start'}>{timeDiffLabel}</p>
                            </div>
                        </div>
                    </div>
                    {getQuestCardStatusButton(startDate, registrationDate, finishDate, status)}
                </Card>
            </ContentWrapper>
        );
    }

    return null;
}
