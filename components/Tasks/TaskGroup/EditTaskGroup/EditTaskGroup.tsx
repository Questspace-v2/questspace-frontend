'use client';

import {Button, Form, Input, Modal} from 'antd';
import {Dispatch, SetStateAction, useMemo, useState} from 'react';
import { getCenter } from '@/lib/utils/utils';
import { useTasksContext } from '@/components/Tasks/ContextProvider/ContextProvider';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import {ValidationStatus} from "@/lib/utils/modalTypes";

interface TaskGroupModalProps {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    taskGroupName?: string,
}

export interface TaskGroupForm {
    groupName: string
}

export default function EditTaskGroup({isOpen, setIsOpen, taskGroupName}: TaskGroupModalProps) {
    const {clientWidth, clientHeight} = document.body;
    const centerPosition = useMemo(() => getCenter(clientWidth, clientHeight), [clientWidth, clientHeight]);
    const { xs } = useBreakpoint();
    const [form] = Form.useForm<TaskGroupForm>();

    const {data: contextData, updater: setContextData} = useTasksContext()!;
    const title = taskGroupName ? 'Изменить название раздела' : 'Название раздела';

    const [validationStatus, setValidationStatus] = useState<ValidationStatus>('success');
    const [errorMsg, setErrorMsg] = useState<string>('');

    const taskGroups = contextData.task_groups ?? [];
    const currentTaskGroup = taskGroups.find(item => item.name === taskGroupName)!;
    const taskGroupIndex = taskGroups.indexOf(currentTaskGroup);

    const handleFieldChange = () => {
        setErrorMsg('');
        setValidationStatus('success');
    };

    const handleSave = () => {
        const groupName = form.getFieldValue('groupName') as string;

        if (!groupName) {
            setValidationStatus('error');
            setErrorMsg('Название не должно быть пустой строкой');
            return;
        }

        if (taskGroupName) {
            taskGroups[taskGroupIndex].name = groupName;
            setContextData({task_groups: taskGroups});
            setIsOpen(false);
            return;
        }

        const pubTime = new Date();
        setContextData({task_groups: [...taskGroups,
                {name: groupName, tasks: [], pub_time: pubTime.toISOString()}
            ]});
        setIsOpen(false);
    };

    const onCancel = () => {
        setErrorMsg('');
        setValidationStatus('success');
        setIsOpen(false);
    }

    return (
      <Modal
          open={isOpen}
          centered
          destroyOnClose
          width={xs ? '100%' : 400}
          title={<h2 className={'roboto-flex-header'}>{title}</h2>}
          mousePosition={centerPosition}
          footer={null}
          onCancel={onCancel}
      >
          <Form
              form={form}
              autoComplete={'off'}
              preserve={false}
              initialValues={{
                  groupName: taskGroupName
              }}
          >
              <Form.Item name={'groupName'} validateStatus={validationStatus} help={errorMsg}>
                  <Input placeholder={'Название раздела'} onChange={handleFieldChange}/>
              </Form.Item>
              <Form.Item>
                  <Button
                      type={'primary'}
                      htmlType={'submit'}
                      block
                      onClick={handleSave}
                  >
                      Сохранить
                  </Button>
              </Form.Item>
          </Form>
      </Modal>
    );
}
