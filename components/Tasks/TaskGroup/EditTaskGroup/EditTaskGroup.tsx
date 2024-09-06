'use client';

import {Button, Form, Input, Modal} from 'antd';
import {Dispatch, SetStateAction, useMemo, useState} from 'react';
import { getCenter } from '@/lib/utils/utils';
import { useTasksContext } from '@/components/Tasks/ContextProvider/ContextProvider';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import {ValidationStatus} from "@/lib/utils/modalTypes";
import {useSession} from "next-auth/react";
import {createTaskGroupsAndTasks} from "@/app/api/api";
import {ITaskGroup, ITaskGroupsCreateRequest} from '@/app/types/quest-interfaces';

interface TaskGroupModalProps {
    questId: string;
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    taskGroupProps?: Pick<ITaskGroup, 'id' | 'pub_time' | 'name'>
}

export interface TaskGroupForm {
    groupName: string
}

export default function EditTaskGroup({questId, isOpen, setIsOpen, taskGroupProps}: TaskGroupModalProps) {
    const {clientWidth, clientHeight} = document.body;
    const centerPosition = useMemo(() => getCenter(clientWidth, clientHeight), [clientWidth, clientHeight]);
    const { xs } = useBreakpoint();
    const [form] = Form.useForm<TaskGroupForm>();

    const {data: contextData, updater: setContextData} = useTasksContext()!;
    const title = taskGroupProps ? 'Изменить название раздела' : 'Название раздела';

    const [validationStatus, setValidationStatus] = useState<ValidationStatus>('success');
    const [errorMsg, setErrorMsg] = useState<string>('');

    const {data: session} = useSession();

    const handleFieldChange = () => {
        setErrorMsg('');
        setValidationStatus('success');
    };

    const handleSave = async () => {
        const taskGroups = contextData.task_groups ?? [];
        const currentTaskGroup = taskGroups.find(item => item.id === taskGroupProps?.id && item.pub_time === taskGroupProps?.pub_time)!;
        const taskGroupIndex = taskGroups.indexOf(currentTaskGroup);
        const groupName = form.getFieldValue('groupName') as string;

        if (!groupName) {
            setValidationStatus('error');
            setErrorMsg('Название не должно быть пустой строкой');
            return;
        }

        if (taskGroupProps) {
            taskGroups[taskGroupIndex].name = groupName;
            const data: ITaskGroupsCreateRequest = {
                ...contextData,
                task_groups: taskGroups,
            };
            setIsOpen(false);
            await createTaskGroupsAndTasks(questId, data, session?.accessToken);
            setContextData((prevState) => ({
                ...prevState,
                task_groups: taskGroups
            }))
            return;
        }

        const pubTime = new Date();
        taskGroups.push({name: groupName, tasks: [], pub_time: pubTime.toISOString()});
        const data: ITaskGroupsCreateRequest = {
            ...contextData,
            task_groups: taskGroups,
        };
        await createTaskGroupsAndTasks(questId, data, session?.accessToken);
        setContextData((prevState) => ({
            ...prevState,
            task_groups: taskGroups
        }));
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
                  groupName: taskGroupProps?.name
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
