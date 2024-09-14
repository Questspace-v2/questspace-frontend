import React, {Dispatch, SetStateAction, useState} from 'react';
import { EditOutlined } from '@ant-design/icons';
import CustomModal, { customModalClassname } from '@/components/CustomModal/CustomModal';
import { IAdminLeaderboardResult, IEditPenaltyRequest } from '@/app/types/quest-interfaces';
import {editTeamPenalty} from '@/app/api/api';
import { useSession } from 'next-auth/react';
import {Button, Form, InputNumber, message} from 'antd';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import classNames from 'classnames';

interface EditPenaltyProps {
    record: IAdminLeaderboardResult;
    questId: string;
    setShouldUpdateTable: Dispatch<SetStateAction<boolean>>;
}

export default function EditPenalty({record, questId, setShouldUpdateTable}: EditPenaltyProps) {
    const [showModal, setShowModal] = useState(false);
    const {xs} = useBreakpoint();
    const {data: session} = useSession();
    const [form] = Form.useForm();
    const [currentValue, setCurrentValue] =
        useState<number>(-1 * record.penalty);
    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        // eslint-disable-next-line no-void
        void messageApi.open({
            type: 'success',
            content: 'Баллы добавлены',
            style: {
                color: '#389E0D'
            }
        });
    };

    const error = () => {
        // eslint-disable-next-line no-void
        void messageApi.open({
            type: 'error',
            content: 'Не удалось добавить баллы',
            style: {
                color: '#CC212A'
            }
        });
    };

    const handleFieldChange = () => {
        setCurrentValue(Number(form.getFieldValue('penalty')));
    };

    const onCancel = () => {
        setShowModal(false);
    };

    const editPenalty = async () => {
        if (!currentValue) {
            return;
        }

        const data: IEditPenaltyRequest  = {
            penalty: -1 * (record.penalty + currentValue),
            team_id: `${record.team_id}`
        };

        try {
            await editTeamPenalty(questId, data, session?.accessToken)
            setShouldUpdateTable(true);
            success();
        } catch {
            error();
        }
        setShowModal(false)
    };

    return (
        <>
            {contextHolder}
            <button
                className={'leaderboard__edit-penalty'}
                aria-label={'Редактировать бонус'}
                type={'button'}
                onClick={() => setShowModal(prevState => !prevState)}
            >
                <EditOutlined />
            </button>
            <CustomModal open={showModal}
                         destroyOnClose
                         onCancel={onCancel}
                         width={xs ? '100%' : 400}
                         centered
                         title={<h2 className={classNames(`${customModalClassname}-header-large`, 'roboto-flex-header')}>Бонус
                             команде</h2>}
                         footer={null}
            >
                <div className={'edit-penalty__description'}>
                    <span className={'team-name'}>Команда: {record.team_name}</span>
                    <span className={'light-description'}>Чтобы начислить штраф, введите число меньше нуля</span>
                </div>
                <Form
                    form={form}
                    autoComplete={'off'}
                    preserve={false}
                    initialValues={{'penalty': -1 * record.penalty}}
                >
                    <Form.Item name={'penalty'} rules={[{ required: true, message: 'Введите количество баллов' }]}>
                        <InputNumber
                            type={'number'}
                            style={{ borderRadius: '2px', width: '100%' }}
                            step={100}
                            value={currentValue}
                            placeholder={'Количество баллов'}
                            onChange={handleFieldChange}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type={'primary'} htmlType={'submit'} block onClick={editPenalty}>Сохранить</Button>
                    </Form.Item>
                </Form>
            </CustomModal>
        </>
    );
}
