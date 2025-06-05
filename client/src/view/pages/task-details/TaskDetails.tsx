import React, { startTransition, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTask, newTask } from './TaskDetails.service';
import { IBoard, IBoardTask } from '@/store/data.model';
import { UniqueIdentifier } from '@dnd-kit/core';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { createConfigForm } from '@/shared/utils/form-config';
import { formConfig, schema } from './TaskDetails.config';
import FormElements from '@/shared/components/formElements/FormElements';
import { catchError, of, tap } from 'rxjs';
import { useGlobalStore } from '@/store/useGlobalStore';
// import { fetchBoard$ } from '@/shared/services/ProjectsService';

export interface IFormData {
  title?: string | undefined;
  description?: any;
  statusId?: number;
}

const TaskDetails: React.FC = () => {
  const [data, setData] = useState<IBoardTask | null>(null);
  const board = useGlobalStore((state) => state.project.board ?? {});
  const dicts = useGlobalStore((state) => state.dictionary ?? {});
  const { boardId, taskId } = useParams<{ boardId: string; taskId: string }>();

  const { updateProject } = useGlobalStore();

  const formElements = createConfigForm(formConfig, { prefix: 'menu' });

  const formMethods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {},
  });

  const { setValue, formState, control, watch } = formMethods;

  const formValues = watch();

  const getData = (id: UniqueIdentifier) => {
    const subscription = getTask(id)
      .pipe(
        tap((res) => {
          setData(res);
          const { userId, assignedTo, ...rest } = res || {};
          formMethods.reset({ ...rest });
        }),
        catchError((error) => {
          console.error('Failed to tasks.', error);
          return of(null);
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  };

  const setNewTask = (data: Partial<IBoardTask>) => {
    const subscription = newTask(data)
      .pipe(
        tap((res) => {
          setData({ ...res });
        }),
        catchError((error) => {
          console.error('Error post task.', error);
          return of(null);
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  };

  // useEffect(() => {
  //   if (!board && boardId) {
  //     const subscription = fetchBoard$(boardId)
  //       .pipe(
  //         tap((res) => {
  //           updateBoard(res);
  //         }),
  //         catchError((error) => {
  //           console.error('Error post task.', error);
  //           return of(null);
  //         })
  //       )
  //       .subscribe();
  //     return () => subscription.unsubscribe();
  //   }
  // }, [board, boardId]);

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
    <FormProvider {...formMethods}>
      <div className="task-details">
        <h2 className="title">Task Details</h2>
        <p>Task ID: {taskId}</p>
      </div>

      {formMethods?.getValues()?.title}

      {formElements?.map((el) => (
        <FormElements key={el.formControlName} formControlName={el?.formControlName as string} config={el.config} />
      ))}

      {/* <Controller name="description" control={control} render={({ field }) => <EditorContent editor={editor} />} /> */}
    </FormProvider>
  );
};

export default TaskDetails;
