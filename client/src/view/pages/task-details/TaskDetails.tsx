import React, { startTransition, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTask, newTask } from './TaskDetails.service';
import { IBoard, IBoardTask } from '@/store/data.model';
import { UniqueIdentifier } from '@dnd-kit/core';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AppDispatch, IRootState } from '@/store/store';
import { fetchBoard } from '@/store/actions/boardsActions';
import { createConfigForm } from '@/shared/utils/form-config';
import { formConfig, schema } from './TaskDetails.config';
import FormElements from '@/shared/components/formElements/FormElements';

export interface IFormData {
  title?: string | undefined;
  description?: any;
  statusId?: number;
}

const TaskDetails: React.FC = () => {
  const [data, setData] = useState<IBoardTask | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const board: IBoard | null = useSelector((state: IRootState) => state?.dataSlice?.board ?? null);
  const dicts = useSelector((state: IRootState) => state?.dataSlice.dict);
  const { boardId, taskId } = useParams<{ boardId: string; taskId: string }>();

  const formElements = createConfigForm(formConfig, { prefix: 'menu' });

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {},
  });

  const { setValue, formState, control, watch } = methods;

  const formValues = watch();

  const getData = (id: UniqueIdentifier) => {
    getTask(id)
      .then((res) => {
        setData(res);
        const { userId, assignedTo, ...rest } = res || {};
        methods.reset({ ...rest });
      })
      .catch((e) => {
        console.log('Failed to tasks.', e);
      });
  };

  const setNewTask = (data: Partial<IBoardTask>) => {
    newTask(data)
      .then((res) => {
        setData({ ...res });
      })
      .catch((e) => {
        console.log('Error post task.', e);
      });
  };

  useEffect(() => {
    if (!board && boardId) {
      dispatch(fetchBoard(boardId));
    }
  }, [board, boardId, dispatch]);

  useEffect(() => {
    startTransition(() => {
      getData(taskId as UniqueIdentifier);
    });
  }, [taskId]);

  const handleSubmit = (formData: IFormData) => {
    // const dataForm = { ...formData };
    // const { id } = data || {};
    // if (!id) addNavItem(dataForm, parentId ?? null);
    // if (id) updateNavItem(id, dataForm);
    // onSubmit(data as INavItem);
  };

  return (
    <FormProvider {...methods}>
      <div className="task-details">
        <h2>Task Details</h2>
        <p>Task ID: {taskId}</p>
      </div>

      {methods?.getValues()?.title}

      {formElements?.map((el) => (
        <FormElements key={el.formControlName} formControlName={el?.formControlName as string} config={el.config} />
      ))}

      {/* <Controller name="description" control={control} render={({ field }) => <EditorContent editor={editor} />} /> */}
    </FormProvider>
  );
};

export default TaskDetails;
