import { Button, Checkbox, Col, Form, FormInstance, Input, InputNumber, Row } from 'antd';
import classNames from 'classnames';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { ValidationStatus } from '@/lib/utils/modalTypes';

const {TextArea} = Input;

export interface HintsFormProps {
    hintsFull: {
        defaultPenalty: boolean,
        text: string,
        name?: string,
        penalty: {
            percent?: number,
            score?: number
        }
    }[]
}

export function HintsForm({hintsForm, hintsValidationStatus, setHintsValidationStatus}: {
    hintsForm: FormInstance<HintsFormProps>,
    hintsValidationStatus: Record<string, ValidationStatus>,
    setHintsValidationStatus :React.Dispatch<React.SetStateAction<Record<string, ValidationStatus>>>
}) {
    const increaseHintScore = (key: number, step = 10) => {
        const prev = hintsForm.getFieldValue(['hintsFull', key, 'penalty', 'score']) as number ?? 0;
        hintsForm.setFieldValue(['hintsFull', key, 'penalty', 'score'], prev + step);
    };

    const decreaseHintScore = (key: number, step = 10) => {
        const prev = hintsForm.getFieldValue(['hintsFull', key, 'penalty', 'score']) as number ?? 0;
        hintsForm.setFieldValue(['hintsFull', key, 'penalty', 'score'], Math.max(prev - step, 1));
    };

    const handleFieldChange = (fieldName: string) => {
        setHintsValidationStatus(prevState => ({
            ...prevState,
            [fieldName]: 'success',
        }));
    };

    return (
        <Form form={hintsForm}>
            <Row>
                <Col className={'edit-task__labels'}>
                    <span>Подсказки (max 3)<span className={'light-description'}><br/>поддерживает Markdown</span></span>
                </Col>
                <Col flex={'auto'} className={'edit-task__hints-list'}>
                    <Form.List name={'hintsFull'}>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div className={'task-hint__wrapper'} key={key}>
                                        <div className={'task-hint__name'}>
                                            <Form.Item
                                                name={[key, 'name']}
                                                {...restField}
                                                className={classNames('task-hint__form-item')}
                                            >
                                                <Input
                                                    placeholder={`Подсказка ${name + 1}`}
                                                />
                                            </Form.Item>
                                            <Button danger onClick={() => {
                                                remove(name);
                                            }}>
                                                <DeleteOutlined />
                                            </Button>
                                        </div>
                                        <Form.Item
                                            name={[key, 'text']}
                                            {...restField}
                                            className={classNames('task-hint__form-item')}
                                        >
                                            <TextArea
                                                style={{ resize: 'none', width: '100%' }}
                                                placeholder={'Текст подсказки'}
                                            />
                                        </Form.Item>
                                        <Row style={{gap: '16px'}}>
                                            <Col>
                                                <Form.Item
                                                    name={[key, 'penalty', 'score']}
                                                    {...restField}
                                                    labelAlign={'left'}
                                                    label={'Стоимость подсказки'}
                                                    colon={false}
                                                >
                                                    <InputNumber
                                                        addonBefore={
                                                            <MinusOutlined
                                                                style={{ background: '--background-primary' }}
                                                                onClick={() => {
                                                                    decreaseHintScore(key);
                                                                    handleFieldChange('hintsFull');
                                                                }}
                                                            />}
                                                        addonAfter={
                                                            <PlusOutlined
                                                                style={{ background: '--background-primary' }}
                                                                onClick={() => {
                                                                    increaseHintScore(key);
                                                                    handleFieldChange('hintsFull');
                                                                }}
                                                            />}
                                                        type={'number'}
                                                        controls={false}
                                                        onChange={() => {
                                                            handleFieldChange('hintsFull');
                                                        }}
                                                        min={1}
                                                        style={{ width: '128px', maxWidth: '128px', textAlignLast: 'center' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col>
                                                <Form.Item
                                                    name={[key, 'defaultPenalty']}
                                                    valuePropName={'checked'}
                                                    {...restField}
                                                    className={classNames('task-hint__form-item')}
                                                >
                                                    <Checkbox
                                                        onChange={() => {
                                                            handleFieldChange('hintsFull');
                                                        }}
                                                    >
                                                        20% от стоимости задачи
                                                    </Checkbox>
                                                </Form.Item>
                                            </Col>
                                        </Row>


                                        <span className={'light-description'}>
                                            Выбрано: {
                                            hintsForm.getFieldValue(['hintsFull', key, 'defaultPenalty']) ?
                                                '20 процентов' :
                                                `${hintsForm.getFieldValue(['hintsFull', key, 'penalty', 'score'])} баллов`
                                        }
                                        </span>
                                    </div>
                                ))}
                                <Form.Item>
                                <Button
                                        className={'edit-task__add-button'}
                                        onClick={() => {
                                            add({
                                                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
                                                index: (hintsForm.getFieldValue(['hintsFull']) ?? []).length,
                                                penalty: { score: 60 },
                                                defaultPenalty: true
                                            });
                                        }}
                                        disabled={fields.length >= 3}
                                        type={'link'}
                                    >
                                        <PlusOutlined/> Добавить подсказку
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Col>
                {hintsValidationStatus.hintsFull === 'error' && (
                    <p className='edit-task__answers-error'>{'Сумма штрафов должна быть меньше стоимости задачи'}</p>
                )}
            </Row>
        </Form>
    )
}
