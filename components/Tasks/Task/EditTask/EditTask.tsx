'use client';

import { Button, Col, ConfigProvider, Form, Input, InputNumber, Modal, Row, Upload } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { getCenter } from '@/lib/utils/utils';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { MinusOutlined, PlusOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons';

import './EditTask.css';
import theme from '@/lib/theme/themeConfig';
import ru_RU from 'antd/lib/locale/ru_RU';

const {TextArea} = Input;

interface TaskCreateModalProps {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

export default function EditTask({isOpen, setIsOpen}: TaskCreateModalProps) {
    const {clientWidth, clientHeight} = document.body;
    const centerPosition = useMemo(() => getCenter(clientWidth, clientHeight), [clientWidth, clientHeight]);
    const [form] = Form.useForm();
    const { xs, md } = useBreakpoint();

    const [pointsAmount, setPointsAmount] = useState(0);

    const increasePointsAmount = () => {
        setPointsAmount((prevAmount) => prevAmount + 1);
    };

    const decreasePointsAmount = () => {
        if (pointsAmount > 1) {
            setPointsAmount((prevAmount) => prevAmount - 1);
        }
    };

    const onCancel = () => {
        setIsOpen(false);
    };

    const handleSaveTask = () => {

    }

    return (
        <ConfigProvider theme={theme} locale={ru_RU}>
            <Modal
                className={'edit-task__modal'}
                classNames={{content: 'edit-task__content'}}
                open={isOpen}
                width={xs ?? md ? '100%': 800}
                centered
                destroyOnClose
                mousePosition={centerPosition}
                title={<h3 className={'roboto-flex-header'}>Редактирование задачи</h3>}
                onCancel={onCancel}
                footer={[
                    <Button key={'save'} type={'primary'} onClick={handleSaveTask}>
                        Сохранить изменения
                    </Button>,
                    <Button key={'cancel'} onClick={onCancel}>
                        Отменить
                    </Button>
                ]}
            >
                <Form form={form}>
                    <Row>
                        <Col className={'edit-task__labels'}>
                            <span>Название задания</span>
                        </Col>
                        <Col flex={'auto'}>
                            <FormItem>
                                <Input type={'text'} placeholder={'Название задания'}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={'edit-task__labels'}>
                            <span>Текст задания</span>
                        </Col>
                        <Col flex={'auto'}>
                            <FormItem>
                                <TextArea placeholder={'Текст задания'} style={{resize: 'none', height: '320px'}}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={'edit-task__labels'}>
                            <span>Картинка</span>
                        </Col>
                        <Col flex={'auto'}>
                            <FormItem>
                                <Upload maxCount={1} showUploadList={false}>
                                    {/* eslint-disable-next-line no-constant-condition */}
                                    {0 > 1 ? (
                                        <Button><ReloadOutlined />Заменить</Button>
                                    ) : (
                                        <Button><UploadOutlined />Загрузить</Button>
                                    )}
                                </Upload>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={'edit-task__labels'}>
                            <span>Подсказки (max 3)<span style={{ color: '#00000073' }}><br/>поддерживает Markdown</span></span>
                        </Col>
                        <Col flex={'auto'}>
                            <FormItem>
                                <Button>
                                    <PlusOutlined/> Добавить подсказку
                                </Button>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={'edit-task__labels'}>
                            <span>Варианты ответа</span>
                        </Col>
                        <Col flex={'auto'}>
                            <FormItem>
                                <Button>
                                    <PlusOutlined/> Добавить вариант ответа
                                </Button>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={'edit-task__labels'}>
                            <span>Баллы за задание</span>
                        </Col>
                        <Col flex={'auto'}>
                            <FormItem>
                                <InputNumber
                                    addonBefore={
                                        <MinusOutlined
                                            onClick={decreasePointsAmount}
                                        />}
                                    addonAfter={
                                        <PlusOutlined
                                            onClick={increasePointsAmount}
                                        />}
                                    controls={false}
                                    min={1}
                                    style={{width: '128px', textAlignLast: 'center'}}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </ConfigProvider>
    );
}
