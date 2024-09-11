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
    UploadFile, UploadProps,
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
import {ValidationStatus} from "@/lib/utils/modalTypes";

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
    const [changedFields, setChangedFields] = useState<string[]>([]);

    const defaultFieldsValidationStatus: Record<string, ValidationStatus> = {
        name: 'success',
        description: 'success',
        image: 'success',
        registrationDeadline: 'success',
        startTime: 'success',
        finishTime: 'success',
        access: 'success'
    };
    const [fieldsValidationStatus, setFieldsValidationStatus] = useState(defaultFieldsValidationStatus);

    const noImageError = 'Добавьте обложку';
    const fileIsTooBigError = 'Файл слишком большой';
    const unsupportedFileTypeError = 'Неподдерживаемый тип файла';

    const [fileIsTooBig, setFileIsTooBig] = useState(false);
    const [unsupportedFileType, setUnsupportedFileType] = useState(false);

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

    const handleUploadValueChange: UploadProps['onChange'] = (info) => {
        const isMoreThan5Mb = Boolean(info.file.size && info.file.size / 1024 / 1024 >= 5);
        const isFileTypeUnsupported = !info.file.type?.startsWith('image/');
        setFileList(info.fileList);
        handleError('');

        if (!isMoreThan5Mb && !isFileTypeUnsupported) {
            setFieldsValidationStatus((prevState) => ({
                ...prevState,
                image: 'success'
            }));
        }

        setFileIsTooBig(isMoreThan5Mb);
        setUnsupportedFileType(isFileTypeUnsupported);
    };

    const handleS3Response = () => {
        const file = fileList[0].originFileObj as File;
        const fileType = file.type;
        if (unsupportedFileType || fileIsTooBig) {
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

        // eslint-disable-next-line consistent-return
        return form.validateFields()
            .then(values => {
                if (!values.name || !values.description || !values.registrationDeadline
                    || !values.startTime || !values.finishTime || !values.access
                    || !s3Response && !previousImage) {
                    setFieldsValidationStatus((prevState) => ({
                        ...prevState,
                        name: !values.name ? 'error' : prevState.name,
                        description: !values.description ? 'error' : prevState.description,
                        registrationDeadline: !values.registrationDeadline ? 'error' : prevState.registrationDeadline,
                        startTime: !values.startTime ? 'error' : prevState.startTime,
                        finishTime: !values.finishTime ? 'error' : prevState.finishTime,
                        access: !values.access ? 'error' : prevState.access,
                        image: !s3Response && !previousImage && !fileIsTooBig ? 'error' : prevState.image,
                    }));
                    return null;
                }

                return {
                    access: values.access,
                    description: values.description,
                    finish_time: values.finishTime,
                    max_team_cap: values.maxTeamCap,
                    name: values.name,
                    registration_deadline: values.registrationDeadline,
                    start_time: values.startTime,
                    media_link: (s3Response as Response).url ?? previousImage
                };
            })
            .catch(error => {
                throw error;
            });
    };

    const handleRequest = async (data: IQuestCreate) => {
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

    const handleSubmit = async () => {
        const data = await handleValidation();
        if (!data) {
            handleError();
            return;
        }

        await handleRequest(data);
    }

    const getImageErrorText = () => {
        if (unsupportedFileType) {
            return unsupportedFileTypeError;
        }

        if (fileIsTooBig) {
            return fileIsTooBigError;
        }

        return noImageError;
    }

    return (
        <div className={'quest-editor__wrapper'}>
            <ConfigProvider theme={theme} locale={ru_RU}>
                <Form
                    form={form}
                    requiredMark={false}
                    initialValues={{ 'maxTeamCap': initialTeamCapacity ?? 3 }}
                    fields={[
                        { name: 'maxTeamCap', value: teamCapacity },
                        {
                            name: 'registrationDeadline', value: registrationDeadlineChecked ?
                                form.getFieldValue('startTime') as Date :
                                form.getFieldValue('registrationDeadline') as Date
                        }
                    ]}
                    autoComplete={'off'}
                >
                    {errorMsg && <p className={'quest-editor__validation-error'}>{errorMsg}</p>}
                    <h3 className={'roboto-flex-header quest-editor__subheader'}>Описание квеста</h3>
                    <Form.Item<QuestAboutForm>
                        name={'name'}
                        label={'Название квеста'}
                        colon={false}
                        required
                        validateStatus={fieldsValidationStatus.name}
                    >
                        <Input
                            type={'text'}
                            onChange={() => {
                                handleValueChange('name');
                                setFieldsValidationStatus((prevState) => ({
                                    ...prevState,
                                    name: 'success'
                                }));
                            }}
                        />
                    </Form.Item>
                    <Form.Item<QuestAboutForm>
                        name={'description'}
                        label={
                            <p className={'description__label'}>
                                Описание <span className={'light-description'}>поддерживает Markdown</span>
                            </p>
                        }
                        colon={false}
                        validateStatus={fieldsValidationStatus.description}
                    >
                        <TextArea
                            style={{ resize: 'none', height: '320px' }}
                            onChange={() => {
                                handleValueChange('description');
                                setFieldsValidationStatus((prevState) => ({
                                    ...prevState,
                                    description: 'success'
                                }));
                            }}
                        />
                    </Form.Item>
                    <Form.Item<QuestAboutForm>
                        className={'quest-editor__small-field quest-editor__image-form-item'}
                        label={<>Обложка<span className={'light-description'}>&nbsp;(до 5 МБ)</span></>}
                        colon={false}
                        help={
                            fieldsValidationStatus.image === 'error' || fileIsTooBig || unsupportedFileType &&
                            <p className={'quest-editor__validation-error'}>{getImageErrorText()}</p>
                        }
                        validateStatus={fileIsTooBig ? 'error' : fieldsValidationStatus.image}
                    >
                        <Upload maxCount={1}
                                showUploadList={false}
                                fileList={fileList}
                                onChange={handleUploadValueChange}
                                accept={'image/*'}
                        >
                            {fileList.length > 0 ? (
                                <Button><ReloadOutlined />Заменить</Button>
                            ) : (
                                <Button><UploadOutlined />Загрузить</Button>
                            )}
                        </Upload>
                        {fileList.length > 0 && <div className={'quest-editor__image-file'}><FileImageOutlined />
                            <p>{fileList[0].originFileObj?.name}</p></div>}
                    </Form.Item>
                    <h3 className={'roboto-flex-header quest-editor__subheader'}>Регистрация</h3>
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
                            style={{ width: '128px', textAlignLast: 'center' }}
                            onChange={(value) => {
                                setTeamCapacity(value ?? (initialTeamCapacity ?? 1));
                                handleValueChange('maxTeamCap')
                            }}
                        />
                    </Form.Item>
                    <Form.Item<QuestAboutForm>
                        name={'registrationDeadline'}
                        className={'quest-editor__small-field'}
                        label={'Дедлайн регистрации'}
                        colon={false}
                        extra={<Checkbox checked={registrationDeadlineChecked}
                                         onClick={() => setRegistrationDeadlineChecked((prev) => !prev)}
                                         style={{ padding: '5px 0' }}>Совпадает с началом квеста</Checkbox>}
                        validateStatus={fieldsValidationStatus.registrationDeadline}
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
                            onChange={() => {
                                handleValueChange('registrationDeadline');
                                setFieldsValidationStatus((prevState) => ({
                                    ...prevState,
                                    registrationDeadline: 'success'
                                }));
                            }}
                        />
                    </Form.Item>
                    <h3 className={'roboto-flex-header quest-editor__subheader'}>Время квеста</h3>
                    <Form.Item<QuestAboutForm>
                        name={'startTime'}
                        className={'quest-editor__small-field'}
                        label={'Старт'}
                        colon={false}
                        validateStatus={fieldsValidationStatus.startTime}
                    >
                        <DatePicker
                            disabledDate={(value) => value.isBefore(dayjs(), 'day') || value > form.getFieldValue('finishTime')}
                            format="DD MMMM YYYY HH:mm"
                            showTime={{ defaultValue: dayjs('00:00', 'HH:mm') }}
                            needConfirm={false}
                            onChange={() => {
                                handleValueChange('startTime');
                                setFieldsValidationStatus((prevState) => ({
                                    ...prevState,
                                    startTime: 'success'
                                }));
                            }}
                        />
                    </Form.Item>
                    <Form.Item<QuestAboutForm>
                        name={'finishTime'}
                        className={'quest-editor__small-field'}
                        label={'Завершение'}
                        colon={false}
                        validateStatus={fieldsValidationStatus.finishTime}
                    >
                        <DatePicker
                            disabledDate={(value) => value.isBefore(dayjs(), 'day') || value < form.getFieldValue('startTime')}
                            format="DD MMMM YYYY HH:mm"
                            showTime={{ defaultValue: dayjs('00:00', 'HH:mm') }}
                            needConfirm={false}
                            onChange={() => {
                                handleValueChange('finishTime');
                                setFieldsValidationStatus((prevState) => ({
                                    ...prevState,
                                    finishTime: 'success'
                                }));
                            }}
                        />
                    </Form.Item>
                    <h3 className={'roboto-flex-header quest-editor__subheader'}>Другие настройки</h3>
                    <Form.Item<QuestAboutForm>
                        className={'quest-editor__small-field quest-editor__access-form-item'}
                        name={'access'}
                        labelAlign={'left'}
                        label={'Доступ к квесту'}
                        colon={false}
                        required
                        help={fieldsValidationStatus.access === 'error' &&
                            <p className={'quest-editor__validation-error'}>Выберите тип доступа</p>}
                        validateStatus={fieldsValidationStatus.access}
                    >
                        <Radio.Group
                            onChange={() => {
                                handleValueChange('access');
                                setFieldsValidationStatus((prevState) => ({
                                    ...prevState,
                                    access: 'success'
                                }));
                            }}>
                            <Radio value={'public'}>
                                Публичный
                                <p className={'light-description'}>Квест увидят все пользователи Квестспейса</p>
                            </Radio>
                            <Radio value={'link_only'}>
                                Только по ссылке
                                <p className={'light-description'}>Квест увидят только пользователи, которые
                                    зарегистрировались на него</p>
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item className={'quest-editor__controls'}>
                        {contextHolder}
                        <QuestEditorButtons handleSubmit={handleSubmit} isNewQuest={isNewQuest} />
                    </Form.Item>
                </Form>
            </ConfigProvider>
        </div>
    );
}
