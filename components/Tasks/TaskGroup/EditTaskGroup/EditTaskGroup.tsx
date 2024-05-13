'use client';

import {Button, Form, Input, Modal} from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import {Dispatch, SetStateAction, useMemo} from 'react';
import { getCenter } from '@/lib/utils/utils';
import { useTasksContext } from '@/components/Tasks/ContextProvider/ContextProvider';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';

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

    const taskGroups = contextData.task_groups ?? [];
    const currentTaskGroup = taskGroups.find(item => item.name === taskGroupName)!;
    const taskGroupIndex = taskGroups.indexOf(currentTaskGroup);

    const handleSave = () => {
        const groupName = form.getFieldValue('groupName') as string;

        if (taskGroupName) {
            taskGroups[taskGroupIndex].name = groupName;
            setContextData({task_groups: taskGroups});
            return;
        }

        const pubTime = new Date();
        setContextData({task_groups: [...taskGroups,
                {name: groupName, tasks: [], pub_time: pubTime.toISOString()}
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
