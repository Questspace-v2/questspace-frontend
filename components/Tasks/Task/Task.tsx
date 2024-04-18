'use client';

import Image from 'next/image';
import { uid } from '@/lib/utils/utils';
import { Button, Form, Input } from 'antd';
import { IHintRequest, ITask, ITaskAnswer } from '@/app/types/quest-interfaces';
import { SendOutlined } from '@ant-design/icons';
import FormItem from 'antd/lib/form/FormItem';
import { getTaskExtra, TasksMode } from '@/components/Tasks/Tasks.helpers';

import './Task.css';
import { answerTaskPlayMode, takeHintPlayMode } from '@/app/api/api';
import { useSession } from 'next-auth/react';

export default function Task({mode, props, questId}: {mode: TasksMode, props: ITask, questId: string}) {
    const {name, question, hints, media_link: mediaLink, correct_answers: correctAnswers, id: taskId} = props;
    const editMode = mode === TasksMode.EDIT;
    const severalAnswers = editMode ? correctAnswers.length > 1 : false;
    const [form] = Form.useForm();
    const {data: session} = useSession();

    const handleTakeHint = async (index: number) => {
        const data: IHintRequest = {
            index,
            task_id: taskId!
        };

        await takeHintPlayMode(questId, data, session?.accessToken);
    };

    const handleSendAnswer = async () => {
        const answer = form.getFieldValue('task-answer') as string;
        const data: ITaskAnswer = {
            taskID: taskId!,
            text: answer
        };

        await answerTaskPlayMode(questId, data, session?.accessToken);
    };

    return (
        <div className={'task__wrapper'}>
            <div className={'task__text-part'}>
            <h4 className={'roboto-flex-header task__name'}>{name}</h4>
                {getTaskExtra(mode === TasksMode.EDIT, true)}
            <p className={'task__question'}>{question}</p>
            </div>
            {mediaLink && (
                <div className={'task__image-part task-image__container'}>
                    <Image src={mediaLink} alt={'task image'} width={300} height={300}/>
                </div>
            )}
            {hints.length > 0 && (
                <div className={'task__hints-part task-hints__container'}>
                    {hints.map((_, index) =>
                        <div className={'task-hint__container'} key={uid()}>
                            <span className={'hint__title'}>Подсказка {index + 1}</span>
                            <Button type={'link'} onClick={() => handleTakeHint(index)}>Открыть</Button>
                        </div>
                    )}
                </div>
            )}
            <Form className={'task__answer-part'} layout={'inline'} form={form}>
                <FormItem required name={'task-answer'}>
                    <Input placeholder={'Ответ'} style={{borderRadius: 2}} />
                </FormItem>
                <FormItem>
                    <Button type={'primary'} onClick={handleSendAnswer}><SendOutlined/></Button>
                </FormItem>
            </Form>
            {editMode && (<span>{severalAnswers ? 'Правильные ответы:' : 'Правильный ответ:'} {correctAnswers.join('; ')}</span>)}
        </div>
    );
}
