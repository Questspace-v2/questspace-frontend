'use client'

import { UploadFile } from 'antd';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { QuestAboutForm } from '@/components/Quest/EditQuest/QuestEditor/QuestEditor';
import QuestHeader, { QuestHeaderProps } from '@/components/Quest/QuestHeader/QuestHeader';
import QuestDescription from '@/components/Quest/QuestDescription/QuestDescription';

dayjs.locale('ru')

interface QuestEditorProps {
    form: QuestAboutForm,
    file: UploadFile,
    previousImage?: string
}

export default function QuestPreview({form, file, previousImage}: QuestEditorProps) {
    let image = useMemo(()=> file ? URL.createObjectURL(file.originFileObj as Blob) : '', [file]);
    const creator = useSession().data?.user;

    if (!form && !image || (!(image || form.image || form.name || form.description || form.startTime || form.finishTime))) {
        return (
            <div className={'quest-preview__wrapper quest-preview_default'}>
                <p>Здесь появится предпросмотр квеста</p>
            </div>
        );
    }

    if (form.image && !file) {
        image = form.image;
    }

    const {name, description, startTime, finishTime, maxTeamCap, questType} = form;
    const {name: username, image: avatarUrl, id: creatorId} = creator!;
    const props: QuestHeaderProps = {
        name,
        description,
        start_time: startTime,
        creator: {
            avatar_url: avatarUrl!,
            username: username!,
            id: creatorId
        },
        id: '',
        status: '',
        registration_deadline: '',
        media_link: image.trim().length > 0 ? image : previousImage!,
        finish_time: finishTime,
        access: 'public',
        quest_type: questType,
        max_team_cap: maxTeamCap ?? 0,
        feedback_link: '',
    };

    return (
        <div className={'quest-preview__wrapper'}>
            <QuestHeader mode={'edit'} props={props} />
            <QuestDescription mode={'edit'} description={description} />
        </div>
    );
}
