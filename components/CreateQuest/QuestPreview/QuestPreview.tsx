'use client'

import { UploadFile } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import Markdown from 'react-markdown';

import './QuestPreview.css'
import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { CalendarOutlined, HourglassOutlined } from '@ant-design/icons';
import { getTimeDiff } from '@/components/QuestCard/QuestCard.helpers';

dayjs.locale('ru')

interface QuestEditorProps {
    form: QuestAboutForm,
    file: UploadFile
}

interface QuestAboutForm {
    name: string,
    description: string,
    image: string,
    registrationDeadline: Date | string,
    startTime: Date | string,
    finishTime: Date | string,
    maxTeamCap: number
}

export default function QuestPreview({form, file}: QuestEditorProps) {
    const image = useMemo(()=> file ? URL.createObjectURL(file.originFileObj as Blob) : '', [file]);
    const creator = useSession().data?.user;

    if (!form && !image || (!(image || form.name || form.description || form.startTime || form.finishTime))) {
        return (
            <div className={'quest-preview__wrapper quest-preview_default'}>
                <p>Здесь появится предпросмотр квеста</p>
            </div>
        );
    }

    const {name, description, startTime, finishTime} = form;
    const {name: username, image: avatarUrl} = creator!;
    const startDate = new Date(startTime);
    const timeDiffLabel = getTimeDiff(startDate, new Date(finishTime));
    const startDayMonth = startDate.toLocaleString('ru', {day: 'numeric', month: 'long'});
    const startHourMinute = startDate.toLocaleString('ru', {hour: 'numeric', minute: '2-digit'});



    return (
        <div className={'quest-preview__wrapper'}>
            {file &&
                <div style={{
                    aspectRatio: '2/1',
                    width: '100%',
                    height: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    borderRadius: '16px',
                }}>
                    <Image
                        src={image}
                        width={1000}
                        height={1000}
                        style={{ maxWidth: '100%', objectFit: 'contain', height: 'auto' }}
                        alt={'quest image'}
                    />
                </div>
            }
            <h2 className={'roboto-flex-header'}>{name}</h2>
            <div className={'quest-card__text-content'}>
                <div className={'quest-preview__information'}>
                    <div className={'information__block'}>
                        <Image src={avatarUrl!} alt={'creator avatar'} priority draggable={false} width={16}
                               height={16} style={{ borderRadius: '8px' }} />
                        <p>{username}</p>
                    </div>
                    {startTime && <div className={'information__block'}>
                        <CalendarOutlined />
                        <p className={'quest-card__start'}>{`${startDayMonth} в ${startHourMinute}`}</p>
                    </div>}
                    {startTime && finishTime && <div className={'information__block'}>
                        <HourglassOutlined />
                        <p className={'quest-card__start'}>{timeDiffLabel}</p>
                    </div>}
                </div>
            </div>
            {description && <h2 className={'roboto-flex-header'}>О квесте</h2>}
            <Markdown className={'line-break'} disallowedElements={['pre', 'code']}>{description}</Markdown>
        </div>
    );
}
