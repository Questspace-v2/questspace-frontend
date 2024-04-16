'use client';

import { Button, Form, Input, Modal } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { getCenter } from '@/lib/utils/utils';
import { useTasksContext } from '@/components/Tasks/ContextProvider/ContextProvider';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';

interface TaskGroupModalProps {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

export default function TaskGroupCreateModal({isOpen, setIsOpen}: TaskGroupModalProps) {
    const {clientWidth, clientHeight} = document.body;
    const centerPosition = useMemo(() => getCenter(clientWidth, clientHeight), [clientWidth, clientHeight]);
    const [form] = Form.useForm();
    const { xs } = useBreakpoint();

    const {data: contextData, updater: setContextData} = useTasksContext()!;

    const handleSave = () => {
        const groupName = form.getFieldValue('groupName') as string;
        const pubTime = new Date();
        setContextData({task_groups: [...contextData.task_groups,
                {name: groupName, tasks: [], pub_time: pubTime.toLocaleString('ru')}
            ]});
        setIsOpen(false);
    };

    const onCancel = () => {
        setIsOpen(false);
    }

    return (
      <Modal
          open={isOpen}
          centered
          destroyOnClose
          width={xs ? '100%' : 400}
          title={<h2 className={'roboto-flex-header'}>Название раздела</h2>}
          mousePosition={centerPosition}
          footer={null}
          onCancel={onCancel}
      >
          <Form form={form} autoComplete={'off'} preserve={false}>
              <FormItem name={'groupName'}>
                  <Input placeholder={'Название раздела'}/>
              </FormItem>
              <FormItem>
                  <Button
                      type={'primary'}
                      htmlType={'submit'}
                      block
                      onClick={handleSave}
                  >
                      Сохранить
                  </Button>
              </FormItem>
          </Form>
      </Modal>
    );
}