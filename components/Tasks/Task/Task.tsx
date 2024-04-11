import './Task.css';
import Image from 'next/image';
import { uid } from '@/lib/utils/utils';
import { Button, Form, Input } from 'antd';
import { ITask } from '@/app/types/quest-interfaces';
import { SendOutlined } from '@ant-design/icons';
import { useState } from 'react';
import FormItem from 'antd/lib/form/FormItem';

export default function Task({mode, props}: {mode: 'play' | 'edit', props: ITask}) {
    const {name, question, hints, media_link: mediaLink} = props;
    const editMode = mode === 'edit';

    if (editMode) {
        return null;
    }

    return (
        <div className={'task__wrapper'}>
            <div className={'task__text-part'}>
            <h4 className={'roboto-flex-header task__name'}>{name}</h4>
            <p className={'task__question'}>{question}</p>
            </div>
            {mediaLink && (
                <div className={'task__image-part task-image__container'}>
                    <Image src={mediaLink} alt={'task image'} width={300} height={300} style={{objectFit: 'contain', width: 'auto'}}/>
                </div>
            )}
            {hints.length > 0 && (
                <div className={'task__hints-part task-hints__container'}>
                    {hints.map((_, index) =>
                        <div className={'task-hint__container'} key={uid()}>
                            <span className={'hint__title'}>Подсказка {index + 1}</span>
                            <Button type={'link'}>Открыть</Button>
                        </div>
                    )}
                </div>
            )}
            <Form className={'task__answer-part'} layout={'inline'}>
                <FormItem required>
                    <Input placeholder={'Ответ'} style={{borderRadius: 2, minWidth: '300px'}}/>
                </FormItem>
                <FormItem>
                    <Button type={'primary'}><SendOutlined/></Button>
                </FormItem>
            </Form>
        </div>
    );
}
