'use client';

import { usePathname } from 'next/navigation';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import Link from 'next/link';
import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import React from 'react';

export default function QuestAdminPanel({isCreator} : {isCreator: boolean}) {
    const currentPath = usePathname();

    if (isCreator) {
        return (
            <ContentWrapper className={'quest-page__admin-panel'}>
                <p style={{userSelect: 'none'}}>Сейчас вы смотрите на квест как обычный пользователь Квестспейса</p>
                <Link shallow href={`${currentPath}/edit`}>
                    <Button type={'link'} size={'large'} tabIndex={-1}><EditOutlined/>Редактировать квест</Button>
                </Link>

            </ContentWrapper>
        );
    }

    return null;
}
