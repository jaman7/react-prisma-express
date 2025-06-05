import FormElements from '@/shared/components/formElements/FormElements';
import Modal from '@/shared/components/Modal';
import { ButtonsKeys } from '@/shared/enums';
import { IModal } from '@/shared/model';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';
import { formDefault, formModalConfig, schema, translatePrefix } from './ProjectsAssignModal.config';
import { yupResolver } from '@hookform/resolvers/yup';
import { createConfigForm } from '@/shared/utils/form-config';
import { getProjectUsers, updateProjectUsers } from './ProjectsAssignModal.service';
import { catchError, of, tap } from 'rxjs';
import { IBoardProject } from '@/store/data.model';

interface IProps {
  modal?: IModal;
  setModal?: (e: IModal) => void;
}

const { SAVE, CANCEL } = ButtonsKeys;

const ProjectsAssignModal = ({ setModal, modal }: IProps) => {
  const [data, setData] = useState<IBoardProject>({});

  const { dictionary } = useGlobalStore();
  const { t } = useFallbackTranslation();

  const formMethods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: formDefault,
  });

  const formConfig$ = useMemo(
    () => createConfigForm(formModalConfig(), { dictionaries: dictionary, prefix: translatePrefix }),
    [dictionary]
  );

  const getData = useCallback((id: string) => {
    const subscription = getProjectUsers(id as string)
      .pipe(
        tap((res) => {
          const { id, name, users } = res || {};
          const data = {
            id,
            name,
            users,
          };
          setData(data ?? {});
          formMethods.reset((data ?? {}) as IBoardProject);
        }),
        catchError((error) => {
          console.error('Failed to fetch suggestions.', error);
          return of({});
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, []);

  const saveData = useCallback(
    (id: string) => {
      const subscription = updateProjectUsers(id as string, (formMethods.getValues()?.users as string[]) ?? [])
        .pipe(
          tap((res) => {
            const { id, name, users } = res || {};
            const data = {
              id,
              name,
              users,
            };
            setData(data ?? {});
            formMethods.reset((data ?? {}) as IBoardProject);
          }),
          catchError((error) => {
            console.error('Failed to update suggestions.', error);
            return of({});
          })
        )
        .subscribe();
      return () => subscription.unsubscribe();
    },
    [formMethods, modal?.type]
  );

  const onClick = (key: any) => {
    switch (key) {
      case SAVE:
        saveData(data?.id as string);
        break;
      case CANCEL:
        setModal?.({ visible: false });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (!modal?.visible) return;
    getData?.(modal?.id as string);
  }, [modal?.visible]);

  return (
    <Modal
      setVisible={(visible) => setModal?.({ visible })}
      visible={modal?.visible}
      action={onClick}
      isDefaultButtons={true}
      title={t(`modal.${modal?.type?.toLowerCase()}`, { value: data?.name ?? '' })}
      isSaveEnabled={formMethods.formState.isValid && formMethods.formState.isDirty}
    >
      <FormProvider {...formMethods}>
        <form className="form">
          {formConfig$?.map((item, i) => (
            <div className="form--item" key={item.formControlName}>
              <FormElements formControlName={item.formControlName as string} config={item.config} />
            </div>
          ))}
        </form>
      </FormProvider>
    </Modal>
  );
};

export default ProjectsAssignModal;
