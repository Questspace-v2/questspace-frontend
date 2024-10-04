import { Button, Input } from 'antd';
import React, { useState } from 'react';
import remarkGfm from 'remark-gfm';
import Markdown from 'react-markdown';
import classNames from 'classnames';
import { useTasksContext } from '@/components/Tasks/ContextProvider/ContextProvider';
import { updateQuest } from '@/app/api/api';
import { IQuest } from '@/app/types/quest-interfaces';
import { useSession } from 'next-auth/react';
import { EditOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export default function BriefEditButtons() {
    const {data: contextData, updater: setContextData} = useTasksContext()!;
    const [ briefValue, setBriefValue ] = useState<string>(contextData?.quest?.brief ?? '');
    const [ isEditBrief, setIsEditBrief ] = useState<boolean>(false);
    const { data: sessionData } = useSession();
    const accessToken = sessionData?.accessToken;

    const handleSave = async () => {
        const data = {
            ...contextData.quest,
            brief: briefValue,
        }

        const result = await updateQuest(contextData.quest.id, data, accessToken)
            .then(resp => resp as IQuest)
            .catch(error => {
                throw error;
            });

        if (result) {
            setContextData((prevState) => ({
                ...prevState,
                quest: result
            }));
        }

        setIsEditBrief(false);
    }

    const handleCancel = () => {
        setBriefValue(contextData?.quest?.brief ?? '');
        setIsEditBrief(false);
    }

    const getTextElement = () => contextData?.quest?.brief ?
            <Markdown
                className={classNames('line-break', 'brief__text_edit', 'brief__text')}
                disallowedElements={['pre', 'code']}
                remarkPlugins={[remarkGfm]}
            >
                {briefValue}
            </Markdown> :
            <span className={'brief__edit-error'}>Бриф не заполнен</span>

    return (
        <div className={'brief__edit'}>
            {
                isEditBrief ?
                    <TextArea
                        required
                        className={'brief__edit-input'}
                        autoSize={{ minRows: 3, maxRows: 6 }}
                        value={briefValue}
                        onChange={(e) => setBriefValue(e.target.value)}
                    /> :
                    getTextElement()
            }
            <div className={classNames('brief__edit-buttons', 'tasks__edit-buttons')}>
                {isEditBrief ? (
                        <>
                            <Button block onClick={handleSave} type={'primary'}>Сохранить изменения</Button>
                            <Button block onClick={handleCancel} danger>Отменить</Button>
                        </>
                    ) :
                    <Button block onClick={() => setIsEditBrief(!isEditBrief)} ghost><EditOutlined/> Редактировать бриф</Button>
                }
            </div>
        </div>
    )
}
