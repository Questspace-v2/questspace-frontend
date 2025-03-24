'use client';

import React, { useMemo } from 'react';
import { parseToMarkdown } from '@/lib/utils/utils';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { Skeleton } from 'antd';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import classNames from 'classnames';

interface QuestDescriptionProps {
    description?: string;
    mode: 'page' | 'edit'
}

export default function QuestDescription({ description, mode}: QuestDescriptionProps) {
    const afterParse = useMemo(() => parseToMarkdown(description), [description]);

    if (mode === 'page') {
        return (
            <ContentWrapper className={classNames('quest-page__content-wrapper', 'quest-page__description')}>
                <h2 className={'roboto-flex-header responsive-header-h2'}>О квесте</h2>
                <Skeleton paragraph loading={!afterParse}>
                    <Markdown className={'line-break'} disallowedElements={['pre', 'code']} remarkPlugins={[remarkGfm]}>{afterParse?.toString()}</Markdown>
                </Skeleton>
            </ContentWrapper>
        );
    }

    if (mode === 'edit') {
        return (
            <>
                {description && <h2 className={'roboto-flex-header'}>О квесте</h2>}
                <Markdown className={'line-break quest-preview__about'} disallowedElements={['pre', 'code']} remarkPlugins={[remarkGfm]}>{description}</Markdown>
            </>
        );
    }

    return null;
}
