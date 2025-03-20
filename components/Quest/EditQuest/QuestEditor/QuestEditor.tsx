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
import { IQuest, IQuestCreate, IQuestTaskGroups } from '@/app/types/quest-interfaces';
import { createQuest, updateQuest } from '@/app/api/api';
import client from '@/app/api/client/client';
import { uid } from '@/lib/utils/utils';
import { useSession } from 'next-auth/react';
import { FRONTEND_URL } from '@/app/api/client/constants';
import { useRouter } from 'next/navigation';
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
    initialTeamCapacity?: number,
    setContextData?: React.Dispatch<React.SetStateAction<IQuestTaskGroups>>
}

export interface QuestAboutForm {
    name: string,
    description: string,
    image: string,
    registrationDeadline: Date | string,
    startTime: Date | string,
    finishTime: Date | string,
    maxTeamCap: number,
    access: string,
    maxTeamsAmount: number | null,
    registrationType: 'AUTO' | 'VERIFY',
    questType: 'ASSAULT' | 'LINEAR',
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
            <Button href={'/'} danger>Отменить</Button>
        </div>
    );
}

export default function QuestEditor({ form, fileList, setFileList, isNewQuest, questId, previousImage, initialTeamCapacity, setContextData }: QuestEditorProps) {
    const [teamCapacity, setTeamCapacity] = useState(initialTeamCapacity ?? 3);
    const [teamsAmount, setTeamsAmount] = useState((form.getFieldValue('maxTeamsAmount') || 3) as number);
    const [noTeamsLimit, setNoTeamsLimit] = useState(!form.getFieldValue('maxTeamsAmount'));
    const registrationEqualsStart =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        (form.getFieldValue('registrationDeadline') ?? '').toString() === (form.getFieldValue('startTime') ?? '').toString();
    const [registrationDeadlineChecked, setRegistrationDeadlineChecked] = useState(isNewQuest ? false : registrationEqualsStart);
    const [messageApi, contextHolder] = message.useMessage();
    const { data: sessionData } = useSession();
    const accessToken = sessionData?.accessToken;
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState('');
    const [changedFields, setChangedFields] = useState<string[]>([]);

    // Состояния для ошибок валидации дат
    const [registrationDeadlineError, setRegistrationDeadlineError] = useState<string | null>(null);
    const [startTimeError, setStartTimeError] = useState<string | null>(null);
    const [finishTimeError, setFinishTimeError] = useState<string | null>(null);

    const defaultFieldsValidationStatus: Record<string, ValidationStatus> = {
        name: 'success',
        description: 'success',
        image: 'success',
        registrationDeadline: 'success',
        startTime: 'success',
        finishTime: 'success',
        access: 'success',
        questType: 'success'
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

    const expandTeamsAmount = () => {
        if (!noTeamsLimit) {
            setTeamsAmount((prev) => prev + 1);
        }
    };

    const shrinkTeamsAmount = () => {
        if (!noTeamsLimit && teamsAmount > 1) {
            setTeamsAmount((prev) => prev - 1);
        }
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

    const validateDates = () => {
        const now = dayjs();

        const registrationStr = form.getFieldValue('registrationDeadline') as string;
        const registrationDeadline = registrationStr ? dayjs(registrationStr) : null;

        const startStr = form.getFieldValue('startTime') as string
        const startTime = startStr ? dayjs(startStr) : null;

        const finishStr = form.getFieldValue('finishTime') as string;
        const finishTime = finishStr ? dayjs(finishStr) : null;

        // Сброс ошибок
        setRegistrationDeadlineError(null);
        setStartTimeError(null);
        setFinishTimeError(null);

        let isValid = true;

        // Проверка registrationDeadline
        if (registrationDeadline?.isBefore(now)) {
            setRegistrationDeadlineError('Дедлайн регистрации не должен быть в прошлом');
            isValid = false;
        }

        // Проверка startTime
        if (startTime?.isBefore(now)) {
            setStartTimeError('Время начала не должно быть в прошлом');
            isValid = false;
        }

        // Проверка finishTime
        if (finishTime?.isBefore(now)) {
            setFinishTimeError('Время финиша не должно быть в прошлом');
            isValid = false;
        }

        // Проверка registrationDeadline <= startTime
        if (!registrationDeadlineChecked && registrationDeadline && startTime && registrationDeadline.isAfter(startTime)) {
            setRegistrationDeadlineError('Дедлайн регистрации не должен быть позже начала');
            isValid = false;
        }

        // Проверка startTime < finishTime
        if (startTime && finishTime && startTime.isAfter(finishTime)) {
            setFinishTimeError('Время финиша не должно быть раньше начала');
            isValid = false;
        }

        return isValid;
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
        const datesValidation = validateDates();

        if (!datesValidation) {
            return null;
        }

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
                        registrationType: !values.registrationType ? 'error' : prevState.registrationType,
                        questType: !values.questType ? 'error' : prevState.questType,
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
                    media_link: (s3Response as Response).url ?? previousImage,
                    max_teams_amount: noTeamsLimit || teamsAmount < 1 ? -1 : teamsAmount,
                    registration_type: values.registrationType,
                    quest_type: values.questType
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
            const result = await updateQuest(questId!, data, accessToken)
                .then(resp => resp as IQuest)
                .catch(err => {
                    throw err;
                })
            if (result) {
                if (setContextData) {
                    setContextData(prevState => ({
                        ...prevState,
                        quest: result,
                    }));
                }
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
                    initialValues={{
                        'maxTeamCap': initialTeamCapacity ?? 3,
                        'access': isNewQuest && 'link_only',
                        'registrationType': isNewQuest && 'AUTO',
                        'questType': isNewQuest && 'ASSAULT',
                    }}
                    fields={[
                        { name: 'maxTeamCap', value: teamCapacity },
                        { name: 'maxTeamsAmount', value: teamsAmount},
                        {
                            name: 'registrationDeadline', value: registrationDeadlineChecked ?
                                form.getFieldValue('startTime') as Date :
                                form.getFieldValue('registrationDeadline') as Date
                        },
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
                        className={'quest-editor__small-field'}
                        name={'maxTeamsAmount'}
                        labelAlign={'left'}
                        label={'Максимальное количество команд'}
                        colon={false}
                        extra={<Checkbox checked={noTeamsLimit}
                                         onClick={() => setNoTeamsLimit((prev) => !prev)}
                                         style={{ padding: '5px 0' }}>Без ограничений</Checkbox>}
                    >
                        <InputNumber
                            addonBefore={
                                <MinusOutlined
                                    onClick={shrinkTeamsAmount}
                                />}
                            addonAfter={
                                <PlusOutlined
                                    onClick={expandTeamsAmount}
                                />}
                            controls={false}
                            disabled={noTeamsLimit}
                            min={1}
                            style={{ width: '128px', textAlignLast: 'center' }}
                            onChange={(value) => {
                                setTeamsAmount(value ?? 1);
                                handleValueChange('maxTeamsAmount')
                            }}
                        />
                    </Form.Item>
                    <Form.Item<QuestAboutForm>
                        shouldUpdate
                        name={'registrationDeadline'}
                        className={'quest-editor__small-field'}
                        label={'Дедлайн регистрации'}
                        colon={false}
                        extra={<>
                            <Checkbox checked={registrationDeadlineChecked}
                                onClick={() => {
                                    setRegistrationDeadlineChecked((prev) => {
                                        if (!prev) {
                                            form.setFieldValue('registrationDeadline', form.getFieldValue('startTime'))
                                        }
                                        return !prev
                                    });
                                }}
                                onChange={validateDates}
                                style={{ padding: '5px 0' }}>Совпадает с началом квеста
                            </Checkbox>
                            {registrationDeadlineError &&
                                <p className={'quest-editor__validation-error'}>{registrationDeadlineError}</p>
                            }
                        </>}
                        validateStatus={fieldsValidationStatus.registrationDeadline}
                    >
                        <DatePicker
                            disabled={registrationDeadlineChecked}
                            format="DD MMMM YYYY HH:mm"
                            showTime={{ defaultValue: dayjs('00:00', 'HH:mm') }}
                            needConfirm={false}
                            onChange={(date) => {
                                if (date === null) {
                                    form.setFieldValue('registrationDeadline', date);
                                }
                                handleValueChange('registrationDeadline');
                                setFieldsValidationStatus((prevState) => ({
                                    ...prevState,
                                    registrationDeadline: 'success'
                                }));
                                validateDates();
                            }}
                        />
                    </Form.Item>
                    <Form.Item<QuestAboutForm>
                        className={'quest-editor__small-field quest-editor__access-form-item'}
                        name={'registrationType'}
                        labelAlign={'left'}
                        label={'Утверждение заявок'}
                        colon={false}
                        help={fieldsValidationStatus.registrationType === 'error' &&
                            <p className={'quest-editor__validation-error'}>Выберите тип регистрации</p>}
                        validateStatus={fieldsValidationStatus.registrationType}
                    >
                        <Radio.Group
                            onChange={() => {
                                handleValueChange('registrationType');
                                setFieldsValidationStatus((prevState) => ({
                                    ...prevState,
                                    registrationType: 'success'
                                }));
                            }}>
                            <Radio value={'VERIFY'}>
                                Включено
                                <p className={'light-description'}>Чтобы принять заявку команды на квест, нужно перейти на вкладку участники</p>
                            </Radio>
                            <Radio value={'AUTO'}>
                                Выключено
                                <p className={'light-description'}>Заявки команд утверждаются сразу же</p>
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <h3 className={'roboto-flex-header quest-editor__subheader'}>Время квеста</h3>
                    <Form.Item<QuestAboutForm>
                        name={'startTime'}
                        className={'quest-editor__small-field'}
                        label={'Старт'}
                        colon={false}
                        extra={startTimeError && <p className={'quest-editor__validation-error'}>{startTimeError}</p>}
                        validateStatus={fieldsValidationStatus.startTime}
                    >
                        <DatePicker
                            format="DD MMMM YYYY HH:mm"
                            showTime={{ defaultValue: dayjs('00:00', 'HH:mm') }}
                            needConfirm={false}
                            onChange={(date) => {
                                if (date === null) {
                                    form.setFieldValue('startTime', date);
                                }
                                if (registrationDeadlineChecked) {
                                    form.setFieldValue('registrationDeadline', date)
                                }
                                handleValueChange('startTime');
                                setFieldsValidationStatus((prevState) => ({
                                    ...prevState,
                                    startTime: 'success'
                                }));
                                validateDates();
                            }}
                        />
                    </Form.Item>
                    <Form.Item<QuestAboutForm>
                        name={'finishTime'}
                        className={'quest-editor__small-field'}
                        label={'Завершение'}
                        colon={false}
                        extra={finishTimeError && <p className={'quest-editor__validation-error'}>{finishTimeError}</p>}
                        validateStatus={fieldsValidationStatus.finishTime}
                    >
                        <DatePicker
                            format="DD MMMM YYYY HH:mm"
                            showTime={{ defaultValue: dayjs('00:00', 'HH:mm') }}
                            needConfirm={false}
                            onChange={(date) => {
                                if (date === null) {
                                    form.setFieldValue('finishTime', date);
                                }
                                handleValueChange('finishTime');
                                setFieldsValidationStatus((prevState) => ({
                                    ...prevState,
                                    finishTime: 'success'
                                }));
                                validateDates();
                            }}
                        />
                    </Form.Item>
                    <h3 className={'roboto-flex-header quest-editor__subheader'}>Другие настройки</h3>
                    <Form.Item<QuestAboutForm>
                        className={'quest-editor__small-field quest-editor__access-form-item'}
                        name={'questType'}
                        labelAlign={'left'}
                        label={'Порядок выдачи заданий'}
                        colon={false}
                        required
                        help={fieldsValidationStatus.access === 'error' &&
                            <p className={'quest-editor__validation-error'}>Выберите тип доступа</p>}
                        validateStatus={fieldsValidationStatus.access}
                    >
                        <Radio.Group
                            onChange={() => {
                                handleValueChange('questType');
                                setFieldsValidationStatus((prevState) => ({
                                    ...prevState,
                                    access: 'success'
                                }));
                            }}>
                            <Radio value={'ASSAULT'}>
                                Штурм
                                <p className={'light-description'}>
                                    Все уровни и задания доступны сразу же после старта
                                </p>
                            </Radio>
                            <Radio value={'LINEAR'}>
                                Линейка
                                <p className={'light-description'}>
                                    Каждый новый уровень открывается через какое-то время или после закрытия предыдущего
                                </p>
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
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