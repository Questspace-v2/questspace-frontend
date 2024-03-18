import { Avatar, Card } from 'antd';
import Image from 'next/image';
import { IUser } from '@/app/types/user-interfaces';

import './QuestCard.css';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import userMock from '@/app/api/__mocks__/User.mock';
import { CalendarOutlined, HourglassOutlined } from '@ant-design/icons';


export interface QuestHeaderProps {
    creator: IUser,
    start_time: string,
    finish_time: string,
    media_link: string,
    name: string,
    registration_deadline: string,
}

function declOfNum(number: number, titles: string[]) {
    const cases: number[] = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

function getTimeDiff(startDate: Date, finishDate: Date) {
    const hours = Math.abs(startDate.getTime() - finishDate.getTime()) / 36e5;
    if (hours >= 24) {
        const days = Math.floor(hours / 24);
        return `${days}\u00A0${declOfNum(days, ['день', 'дня', 'дней'])}`;
    }
    return `${hours}\u00A0${declOfNum(hours, ['час', 'часа', 'часов'])}`;
}

export default function QuestCard({mode, props} : {mode: 'full' | 'preview', props?: QuestHeaderProps}) {
    if (mode === 'preview' && props) {
        return (
            <a href={'/'} className={'quest-card__anchor'}>
                <Card
                    className={'quest-card quest-card__mode_preview'}
                    cover={<Image
                        src={`https://source.unsplash.com/random/${props.name}`}
                        fill style={{ objectFit: 'cover' }} alt={'quest avatar'} loading={'lazy'} placeholder={'empty'}/>}
                >
                    <h3 className={'quest-card__name'}>Городской квест ДПММ</h3>
                    <p className={'quest-card__start'}>25 сентября в 10:00</p>
                    <div className={'status__wrapper'}>
                        <svg className={'quest-card__status_registration'} xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="none" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="4" fill="black" />
                        </svg>
                        <p className={'quest-card__status quest-card__status_registration'}>Регистрация до 25
                            сентября</p>
                    </div>
                </Card>
            </a>
        );
    }

    if (mode === 'full' && props) {
        const { name, start_time: startTime, creator , finish_time: finishTime, media_link: mediaLink} = props;
        const {username, avatar_url: avatarUrl} = creator;
        const startDate = new Date(startTime);
        const finishDate = new Date(finishTime);
        const timeDiffLabel = getTimeDiff(startDate, finishDate);
        const dayMonth = startDate.toLocaleString('ru', {day: 'numeric', month: 'long'});
        const time = startDate.toLocaleString('ru', {hour: 'numeric', minute: '2-digit'})


        return (
            <ContentWrapper className={'quest-card__wrapper'}>
                <Card
                    className={'quest-card quest-card__mode_full'}
                    cover={<Image
                        src={mediaLink}
                        fill style={{objectFit: 'cover'}} alt={'quest avatar'}
                    />}
                    bordered={false}
                >
                    <h1 className={'quest-card__name roboto-flex-header responsive-header-h1'}>{name}</h1>
                    <div className={'quest-card__information'}>
                        <div className={'information__block'}>
                            <Image src={avatarUrl} alt={'creator avatar'} priority draggable={false} width={16} height={16} style={{borderRadius: '8px'}}/>
                            <p>{username !== '' ? username : userMock.username}</p>
                        </div>
                        <div className={'information__block'}>
                            <CalendarOutlined />
                            <p className={'quest-card__start'}>{`${dayMonth} в ${time}`}</p>
                        </div>
                        <div className={'information__block'}>
                            <HourglassOutlined />
                            <p className={'quest-card__start'}>{timeDiffLabel}</p>
                        </div>
                    </div>
                </Card>
            </ContentWrapper>
        );
    }

    return null;
}
