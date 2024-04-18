'use client';

import { Button, Form, Input, InputNumber, Modal, Upload } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { getCenter } from '@/lib/utils/utils';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

const {TextArea} = Input;

interface TaskCreateModalProps {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

export default function TaskCreateModal({isOpen, setIsOpen}: TaskCreateModalProps) {
    const {clientWidth, clientHeight} = document.body;
    const centerPosition = useMemo(() => getCenter(clientWidth, clientHeight), [clientWidth, clientHeight]);
    const [form] = Form.useForm();
    const { xs } = useBreakpoint();

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
        <Modal
            open={isOpen}
            width={xs ? '100%': 800}
            centered
            destroyOnClose
            mousePosition={centerPosition}
            title={'Редактирование задачи'}
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
                <FormItem label={'Название задания'}>
                    <Input type={'text'} placeholder={'Название задания'}/>
                </FormItem>
                <FormItem label={'Текст задания'}>
                    <TextArea placeholder={'Текст задания'} style={{resize: 'none', height: '320px'}}/>
                </FormItem>
                <FormItem label={'Картинка'}>
                    <Upload maxCount={1} showUploadList={false}/>
                </FormItem>
                <FormItem label={'Подсказки (max 3)'}>
                    <Button>
                        <PlusOutlined/> Добавить подсказку
                    </Button>
                </FormItem>
                <FormItem label={'Варианты ответа'}>
                    <Button>
                        <PlusOutlined/> Добавить вариант ответа
                    </Button>
                </FormItem>
                <FormItem label={'Баллы за задание'} colon={false}>
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
            </Form>
        </Modal>
    );
}