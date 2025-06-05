import Modal from '@/shared/components/Modal';
import { ButtonsKeys, MODAL_TYPE } from '@/shared/enums';
import { IModal, IModalType } from '@/shared/model';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IFormElements, IFormElementsEnum } from '@/shared/components/formElements/FormElements.model';
import { createConfigForm } from '@/shared/utils/form-config';
import { formDefault, formModalConfig, schema, translatePrefix } from './ProjectsEditModal.config';
import { useGlobalStore } from '@/store/useGlobalStore';
import { getProject, saveProject } from './ProjectsEditModal.service';
import { catchError, of, tap } from 'rxjs';
import FormElements from '@/shared/components/formElements/FormElements';
import { IDictionaries } from '@/shared/model/dictionary';
import Collapse from '@/shared/components/Collapse';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';
import { IBoardProject } from '@/store/data.model';
import { normalizeProjectData } from './ProjectsEditModal.helper';

interface IProps {
  modal?: IModal;
  setModal?: (e: IModal) => void;
}

const { ADD, EDIT, VIEW } = MODAL_TYPE;
const { SAVE, CANCEL } = ButtonsKeys;
const { DATETIME } = IFormElementsEnum;

const ProjectsEditModal = ({ setModal, modal }: IProps) => {
  const [dictionary, setDictionary] = useState<IDictionaries>(() => ({}) as IDictionaries);

  const { dictionary: dictData } = useGlobalStore();
  const { t } = useFallbackTranslation();

  const formMethods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: formDefault,
  });

  const isEditable = modal?.type === ADD || modal?.type === EDIT;

  const formConfig$ = useMemo(
    () => createConfigForm(formModalConfig(), { dictionaries: dictionary, prefix: translatePrefix }),
    [dictionary]
  );

  const watchedColumns = useWatch({ control: formMethods.control, name: 'columns' });
  const watchedMoveRules = useWatch({ control: formMethods.control, name: 'taskColumnsMoveRules' });
  const watchedName = useWatch({ control: formMethods.control, name: 'name' });

  const modalTitle = useMemo(() => {
    return t(`modal.${modal?.type?.toLowerCase()}`, { value: watchedName ?? '' });
  }, [modal?.type, watchedName]);

  useEffect(() => {
    setDictionary((prev) => ({
      ...prev,
      ...dictData,
      rulesDict:
        watchedColumns?.map((el) => ({ id: el.status, displayName: el.status }))?.filter((el) => el.id !== '' || el.displayName !== '') ??
        [],
    }));
  }, [watchedColumns]);

  useEffect(() => {
    if (!modal?.visible) return;
    if (modal?.type !== ADD) getData?.(modal?.id as string);
  }, [modal?.visible]);

  const getData = useCallback((id: string) => {
    const subscription = getProject(id as string)
      .pipe(
        tap((res) => {
          formMethods.reset(normalizeProjectData(res));
        }),
        catchError((error) => {
          console.error('Failed to fetch suggestions.', error);
          return of({});
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, []);

  const saveData = useCallback(() => {
    const subscription = saveProject(formMethods?.getValues() as IBoardProject, modal?.type as IModalType)
      .pipe(
        tap((res) => {
          formMethods.reset(normalizeProjectData(res));
        }),
        catchError((error) => {
          console.error('Failed to update suggestions.', error);
          return of({});
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, [formMethods, modal?.type]);

  const handlers = {
    [SAVE]: saveData,
    [CANCEL]: () => setModal?.({ visible: false }),
  };

  const onClick = useCallback(
    (key: 'SAVE' | 'CANCEL') => {
      handlers[key]?.();
    },
    [setModal, saveData]
  );

  const itemsConfig = useCallback(
    (data: IFormElements): IFormElements => {
      return {
        ...data,
        dictData: dictionary?.[data?.dictName as string] ?? [],
        disabled: data?.formCellType === DATETIME || modal?.type === VIEW,
      };
    },
    [dictionary, modal?.type, formConfig$]
  );

  return (
    <Modal
      setVisible={(visible) => setModal?.({ visible })}
      visible={modal?.visible}
      action={(key) => onClick(key as 'SAVE' | 'CANCEL')}
      isDefaultButtons={isEditable}
      title={modalTitle}
      isSaveEnabled={formMethods.formState?.isValid && formMethods.formState?.isDirty}
    >
      <FormProvider {...formMethods}>
        <form className="form">
          {formConfig$?.map((item, i) => (
            <div className="form--item" key={item?.formControlName ?? i}>
              <FormElements formControlName={item.formControlName as string} config={itemsConfig(item.config as IFormElements)} />
            </div>
          ))}
        </form>

        <Collapse header="json__view" padding={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 }} className="mt-3">
          <div className="panel-json p-2">
            <h2 className="panel-json__title">Output JSON:</h2>
            <pre className="panel-json__view">{JSON.stringify(watchedMoveRules ?? {}, null, 2)}</pre>
          </div>
        </Collapse>
      </FormProvider>
    </Modal>
  );
};

export default ProjectsEditModal;
