'use client';

import {
    Button,
    Checkbox,
    ConfigProvider,
    DatePicker,
    Form,
    FormInstance,
    Input,
    InputNumber, message,
    Radio,
    ThemeConfig,
    Upload,
    UploadFile,
} from 'antd';
import React, { useState } from 'react';
import { FileImageOutlined, MinusOutlined, PlusOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import ru_RU from 'antd/lib/locale/ru_RU';
import 'dayjs/locale/ru';
import { IQuest, IQuestCreate } from '@/app/types/quest-interfaces';
import { createQuest, updateQuest } from '@/app/api/api';
import client from '@/app/api/client/client';
import { uid } from '@/lib/utils/utils';
import { useSession } from 'next-auth/react';
import { FRONTEND_URL } from '@/app/api/client/constants';
import { useRouter } from 'next/navigation';
import { redOutlinedButton } from '@/lib/theme/themeConfig';

import './QuestEditor.css';

dayjs.locale('ru')

const {TextArea} = Input;

interface QuestEditorProps {
    form: FormInstance<QuestAboutForm>,
    fileList: UploadFile[],
    setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>,
    isNewQuest?: boolean,
    questId?: string,
    previousImage?: string,
    initialTeamCapacity?: number
}

export interface QuestAboutForm {
    name: string,
    description: string,
    image: string,
    registrationDeadline: Date | string,
    startTime: Date | string,
    finishTime: Date | string,
    maxTeamCap: number,
    access: string
}

const theme: ThemeConfig = {
    components: {
        Input: {
            borderRadius: 2
        },
        DatePicker: {
            borderRadius: 2
        },
        Checkbox: {
            borderRadiusSM: 2,
        },
        InputNumber: {
            borderRadius: 2,
        }
    }
};

function QuestEditorButtons({handleSubmit, isNewQuest}: {handleSubmit?: React.MouseEventHandler<HTMLElement>, isNewQuest?: boolean}) {
    const createBtnText = isNewQuest ? 'Создать квест' : 'Сохранить изменения';
    return (
        <div className={'quest-editor__buttons'}>
            <Button htmlType={'submit'}
                    type={'primary'}
                    onClick={handleSubmit}
            >
                {createBtnText}
            </Button>
            <ConfigProvider theme={redOutlinedButton}>
                <Button href={'/'}>Отменить</Button>
            </ConfigProvider>
        </div>
    );
}

export default function QuestEditor({ form, fileList, setFileList, isNewQuest, questId, previousImage, initialTeamCapacity }: QuestEditorProps) {
    const [teamCapacity, setTeamCapacity] = useState(initialTeamCapacity ?? 3);
    const [registrationDeadlineChecked, setRegistrationDeadlineChecked] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const { data: sessionData } = useSession();
    const accessToken = sessionData?.accessToken;
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState('');
    const [changedFields, setChangedFields] = useState<string[]>([])

    const expandTeamCapacity = () => {
        setTeamCapacity((prev) => prev + 1);
    };

    const shrinkTeamCapacity = () => {
        if ((initialTeamCapacity && teamCapacity > initialTeamCapacity) ?? (!initialTeamCapacity && teamCapacity > 1))
            setTeamCapacity((prev) => prev - 1);
    };

    const handleError = (msg = 'Проверьте, что все поля заполнены') => {
        setErrorMsg(msg);
    };

    const handleValueChange = (fieldName: string | number) => {
        setErrorMsg('');
        if (!changedFields.includes(fieldName.toString())) {
            setChangedFields([...changedFields, fieldName.toString()]);
        }
    }

    const success = () => {
        // eslint-disable-next-line no-void
        void messageApi.open({
            type: 'success',
            content: 'Сохранено!',
        });
    };

    const handleS3Response = () => {
        const file = fileList[0].originFileObj as File;
        const fileType = file.type;
        if (!fileType.startsWith('image/')) {
            return;
        }

        const key = `quests/${uid()}`;
        // eslint-disable-next-line consistent-return
        return client.handleS3Request(key, fileType, file)
            .then(res => res)
            .catch(error => {
                throw error;
            });
    };

    const handleValidation = async () => {
        const imageValidation = fileList.length > 0;
        const s3Response = imageValidation && await handleS3Response();
        if (!s3Response && !previousImage) {
            handleError('С картинкой что-то не так');
            return;
        }
        // eslint-disable-next-line consistent-return
        return form.validateFields()
            .then(values => {
                if (!values.name || !values.description || !values.registrationDeadline
                    || !values.startTime || !values.finishTime || !values.access) {
                    handleError();
                    return null;
                }

                return {
                    ...values,
                    media_link: (s3Response as Response).url ?? previousImage
                };
            })
            .catch(error => {
                throw error;
            });
    };

    const handleRequest = () => handleValidation()
            .then(result => {
                if (!result) {
                    handleError();
                    return null;
                }
                const data: IQuestCreate = {
                    access: result.access,
                    description: result.description,
                    finish_time: result.finishTime,
                    max_team_cap: result.maxTeamCap,
                    media_link: result.media_link,
                    name: result.name,
                    registration_deadline: result.registrationDeadline,
                    start_time: result.startTime
                };

                return data;
            })
            .catch(error => {
                throw error;
            });

    const handleSubmit = async () => {
        const data = await handleRequest();
        if (!data) {
            handleError();
            return;
        }
        if (isNewQuest) {
            const result = await createQuest(data, accessToken!)
                .then(resp => resp as IQuest)
                .catch(error => {
                    throw error;
                });
            if (result) {
                router.replace(`${FRONTEND_URL}/quest/${result.id}`, {scroll: false});
            }
        } else {
            const result = await updateQuest(questId!,data, accessToken)
                .then(resp => resp as IQuest)
                .catch(err => {
                    throw err;
                })
            if (result) {
                router.refresh();
                success();
            }
        }
    };

    return (
        <div className={'quest-editor__wrapper'}>
            <ConfigProvider theme={theme} locale={ru_RU}>
                <Form
                    form={form}
                    requiredMark={false}
                    initialValues={{'maxTeamCap': initialTeamCapacity ?? 3}}
                    fields={[
                        {name: 'maxTeamCap', value: teamCapacity},
                        {name: 'registrationDeadline', value: registrationDeadlineChecked ?
                                form.getFieldValue('startTime') as Date :
                                form.getFieldValue('registrationDeadline') as Date
                        }
                    ]}
                    autoComplete={'off'}
                >
                    {errorMsg && <p style={{color: 'red'}}>{errorMsg}</p>}
                    <Form.Item<QuestAboutForm>
                        name={'name'}
                        label={'Название квеста'}
                        colon={false}
                        required
                    >
                        <Input type={'text'} onChange={() => handleValueChange('name')}/>
                    </Form.Item>
                    <Form.Item<QuestAboutForm>
                        name={'description'}
                        label={
                            <p className={'description__label'}>
                                Описание <span style={{color: '#00000073'}}>поддерживает Markdown</span>
                            </p>
                        }
                        colon={false}
                    >
                        <TextArea style={{resize: 'none', height: '320px'}} onChange={() => handleValueChange('description')}/>
                    </Form.Item>
                    <Form.Item<QuestAboutForm>
                        className={'quest-editor__small-field quest-editor__image-form-item'}
                        label={'Обложка'}
                        colon={false}
                    >
                        <Upload maxCount={1} showUploadList={false}
                                fileList={fileList} onChange={({ fileList: fllst }) => setFileList(fllst)}>
                            {fileList.length > 0 ? (
                                <Button><ReloadOutlined />Заменить</Button>
                            ) : (
                                <Button><UploadOutlined />Загрузить</Button>
                            )}

                        </Upload>
                        {fileList.length > 0 && <div className={'quest-editor__image-file'}><FileImageOutlined /><p>{fileList[0].originFileObj?.name}</p></div>}
                    </Form.Item>
                    <Form.Item<QuestAboutForm>
                        name={'registrationDeadline'}
                        className={'quest-editor__small-field'}
                        label={'Дедлайн регистрации'}
                        colon={false}
                        extra={<Checkbox checked={registrationDeadlineChecked} onClick={() => setRegistrationDeadlineChecked((prev) => !prev)} style={{padding: '5px 0'}}>Совпадает с началом квеста</Checkbox>}
                    >
                        <DatePicker
                            disabledDate={
                                (value) =>
                                    value.isBefore(dayjs(), 'day') ||
                                    value > form.getFieldValue('startTime') ||
                                    value > form.getFieldValue('finishTime')
                            }
                            disabled={registrationDeadlineChecked}
                            format="DD MMMM YYYY HH:mm"
                            showTime={{ defaultValue: dayjs('00:00', 'HH:mm') }}
                            needConfirm={false}
                            onChange={() => handleValueChange('registrationDeadline')}
                        />

                    </Form.Item>
                    <Form.Item<QuestAboutForm>
                        name={'startTime'}
                        className={'quest-editor__small-field'}
                        label={'Старт'}
                        colon={false}
                    >
                        <DatePicker
                            disabledDate={(value) => value.isBefore(dayjs(), 'day') || value > form.getFieldValue('finishTime')}
                            format="DD MMMM YYYY HH:mm"
                            showTime={{ defaultValue: dayjs('00:00', 'HH:mm') }}
                            needConfirm={false}
                            onChange={() => handleValueChange('startTime')}
                        />
                    </Form.Item>
                    <Form.Item<QuestAboutForm>
                        name={'finishTime'}
                        className={'quest-editor__small-field'}
                        label={'Завершение'}
                        colon={false}
                    >
                        <DatePicker
                            disabledDate={(value) => value.isBefore(dayjs(), 'day') || value < form.getFieldValue('startTime')}
                            format="DD MMMM YYYY HH:mm"
                            showTime={{ defaultValue: dayjs('00:00', 'HH:mm') }}
                            needConfirm={false}
                            onChange={() => handleValueChange('finishTime')}
                        />
                    </Form.Item>
                    <Form.Item<QuestAboutForm>
                        className={'quest-editor__small-field'}
                        name={'maxTeamCap'}
                        labelAlign={'left'}
                        label={'Размер команды'}
                        colon={false}
                    >
                        <InputNumber
                            addonBefore={
                                <MinusOutlined
                                    onClick={shrinkTeamCapacity}
                                />}
                            addonAfter={
                                <PlusOutlined
                                    onClick={expandTeamCapacity}
                                />}
                            controls={false}
                            min={initialTeamCapacity ?? 1}
                            style={{width: '128px', textAlignLast: 'center'}}
                            onChange={() => handleValueChange('maxTeamCap')}
                        />
                    </Form.Item>
                    <Form.Item<QuestAboutForm>
                        className={'quest-editor__small-field quest-editor__access-form-item'}
                        name={'access'}
                        labelAlign={'left'}
                        label={'Доступ к квесту'}
                        colon={false}
                        required
                    >
                        <Radio.Group onChange={() => handleValueChange('access')}>
                            <Radio value={'public'}>
                                Публичный
                                <p>Квест увидят все пользователи Квестспейса</p>
                            </Radio>
                            <Radio value={'link_only'}>
                                Только по ссылке
                                <p>Квест увидят только пользователи, которые зарегистрировались на него</p>
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item className={'quest-editor__controls'}>
                        {contextHolder}
                        <QuestEditorButtons handleSubmit={handleSubmit} isNewQuest={isNewQuest}/>
                    </Form.Item>
                </Form>
            </ConfigProvider>
        </div>
    );
}
