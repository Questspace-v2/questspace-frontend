'use client';

import {
    Button,
    Checkbox,
    ConfigProvider,
    DatePicker,
    Form,
    FormInstance,
    Input,
    InputNumber,
    ThemeConfig,
    Upload,
    UploadFile,
} from 'antd';

import './QuestEditor.css';
import React, { useState } from 'react';
import { FileImageOutlined, MinusOutlined, PlusOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import ru_RU from 'antd/lib/locale/ru_RU';
import 'dayjs/locale/ru';
import Link from 'next/link';
import { IQuest, IQuestCreate } from '@/app/types/quest-interfaces';
import { createQuest } from '@/app/api/api';
import client from '@/app/api/client/client';
import { uid } from '@/lib/utils/utils';
import { useSession } from 'next-auth/react';

dayjs.locale('ru')

const {TextArea}= Input;
interface QuestEditorProps {
    form: FormInstance<QuestAboutForm>,
    fileList: UploadFile[],
    setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>
}

export interface QuestAboutForm {
    name: string,
    description: string,
    image: string,
    registrationDeadline: Date | string,
    startTime: Date | string,
    finishTime: Date | string,
    maxTeamCap: number
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

export default function QuestEditor({form, fileList, setFileList}: QuestEditorProps) {
    const [teamCapacity, setTeamCapacity] = useState(3);
    const [registrationDeadlineChecked, setRegistrationDeadlineChecked] = useState(false);

    const {data: sessionData} = useSession();
    const accessToken = sessionData?.accessToken;

    const expandTeamCapacity = () => {
        setTeamCapacity((prev) => prev + 1);
    };

    const shrinkTeamCapacity = () => {
        if (teamCapacity > 1) setTeamCapacity((prev) => prev - 1);
    };

    const handleS3Response = () => {
        const file = fileList[0].originFileObj as File;
        const fileType = file.type;
        if (!fileType.startsWith('image/')) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const key = `users/${uid()}`;
        // eslint-disable-next-line consistent-return
        return client.handleS3Request(key, fileType, file)
            .then(res => res)
            .catch(error => {
                throw error;
            });
    };

    const handleValidation = async () => {
        const s3Response = await handleS3Response();
        if (!s3Response) {
            return;
        }

        // eslint-disable-next-line consistent-return
        return form.validateFields()
            .then(values => ({
                    ...values,
                    media_link: s3Response.url
                }))
            .catch(error => {
                throw error;
            });
    };

    const handleRequest = () => handleValidation()
            .then(result => {
                const data: IQuestCreate = {
                    description: result!.description,
                    finish_time: result!.finishTime,
                    max_team_cap: result!.maxTeamCap,
                    media_link: result!.media_link,
                    name: result!.name,
                    registration_deadline: result!.registrationDeadline,
                    start_time: result!.startTime
                };

                return data;
            })
            .catch(error => {
                throw error;
            });

    const handleSubmit = async () => {
        const data = await handleRequest();
        await createQuest(data, accessToken!)
            .then(resp => resp as IQuest)
            .catch(error => {
                throw error;
            });
    };

    return (
        <div className={'quest-editor__wrapper'}>
            <ConfigProvider theme={theme} locale={ru_RU}>
                <Form
                    form={form}
                    requiredMark={false}
                    initialValues={{'maxTeamCap': 3}}
                    fields={[
                        {name: 'maxTeamCap', value: teamCapacity},
                        {name: 'registrationDeadline', value: registrationDeadlineChecked ?
                                form.getFieldValue('startTime') as Date :
                                form.getFieldValue('registrationDeadline') as Date
                        }
                    ]}
                    autoComplete={'off'}
                >
                    <Form.Item<QuestAboutForm>
                        name={'name'}
                        label={'Название квеста'}
                        colon={false}
                        required
                    >
                        <Input type={'text'} />
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
                        <TextArea style={{resize: 'none', height: '320px'}}/>
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
                            min={1}
                            style={{width: '128px', textAlignLast: 'center'}}
                        />
                    </Form.Item>
                    <Form.Item>
                        <div className={'quest-editor__buttons'}>
                            <Button htmlType={'submit'}
                                    type={'primary'}
                                    onClick={handleSubmit}>Создать квест</Button>
                            <ConfigProvider theme={{
                                token: {
                                    colorText: '#FF4D4F',
                                    colorPrimaryHover: '#FF4D4F',
                                    colorPrimaryActive: '#FF4D4F'
                                },
                            }}
                            >
                                <Link href={'/'}>
                                    <Button>Отменить</Button>
                                </Link>
                            </ConfigProvider>
                        </div>
                    </Form.Item>
                </Form>
            </ConfigProvider>
        </div>
    );
}
