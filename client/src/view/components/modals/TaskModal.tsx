import { SetStateAction, useState, Dispatch as ReactDispatch, useEffect, MouseEventHandler } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'shared/components/Modal';
import { IFormElements } from 'shared/components/formElements/FormElements.model';
import { createConfigForm, getChangedValues } from 'shared/utils/helpers';
import { FaRegTrashAlt, FaEdit } from 'react-icons/fa';
import { formTaskConfigDefault } from './Form.config';
import { IDictType, IDictionary } from 'shared/components/select/Select.model';
import { FormikProps, useFormik } from 'formik';
import FormElements from 'shared/components/formElements/FormElements';
import { IRootState } from 'store/store';
import { IButtons, MODAL_TYPE } from 'shared';
import Button from 'shared/components/Button';
import { useTranslation } from 'react-i18next';
import AddEditTaskModal from './AddEditTaskModal';
import DeleteModal from './DeleteModal';
import boardsSlice from 'store/dataSlice';
import { IBoardColumTask } from 'store/data.model';

const { ADD, EDIT } = MODAL_TYPE;

interface IProps {
  task?: IBoardColumTask;
  setIsTaskModalOpen?: ReactDispatch<SetStateAction<boolean>>;
  isTaskModalOpen?: boolean;
  colIndex?: number;
  taskIndex?: number;
  id?: string;
}

const TaskModal = ({ id, task, setIsTaskModalOpen, isTaskModalOpen, colIndex, taskIndex }: IProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const boards = useSelector((state: IRootState) => state.boards);
  const board = boards?.find(board => board.isActive === true) ?? {};
  const columns = board?.columns ?? [];
  // const col = columns?.find((col, i) => i === colIndex) ?? {};
  // const task = col?.tasks?.find((task, i) => i === taskIndex) ?? {};
  const subtasks = task?.subtasks ?? [];
  const dictionary: IDictionary = {};

  const [formConfig, setFormConfig] = useState<IFormElements[]>([]);
  const [isEditTaskModalOpen, setEditTaskModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  // const [newColIndex, setNewColIndex] = useState(columns?.indexOf(col));

  const formik: FormikProps<any> = useFormik({
    initialValues: { currentStatus: null },
    onSubmit: () => {},
  });

  let completed = 0;
  subtasks.forEach(subtask => {
    if (subtask.isCompleted) {
      completed++;
    }
  });

  useEffect(() => {
    console.log(colIndex, taskIndex);
    const statusesDict: IDictType[] = [];
    formik.setFieldValue(`status`, task.status);
    let config: IFormElements = formTaskConfigDefault();

    columns.forEach((el, i) => {
      const { name: displayName } = el || {};
      statusesDict.push({ id: i + 1, displayName });
    });

    subtasks?.forEach(el => {
      config[`${el.id}`] = {
        config: { isHeader: false, formCellType: 'checkbox', placeholder: el?.title ?? '', formCellClass: 'checkbox-text' },
      };
      formik.setFieldValue(`${el.id}`, el.isCompleted);
    });
    dictionary.statusesDict = statusesDict ?? [];

    setFormConfig(createConfigForm(config, { prefix: 'form', dictionaries: dictionary ?? [] }));
    setIsFirstLoad(false);
  }, [columns?.length]);

  useEffect(() => {
    if (!isFirstLoad) {
      const values = getChangedValues(formik.values, formik.initialValues);
      Object.keys(formik?.values)?.forEach(key => {
        if (key !== 'status') {
          const index = subtasks.findIndex(el => el?.id === key && el?.isCompleted !== values[key]) ?? -1;
          if (index > -1) {
            onChangeCompleted(index);
          }
        } else if (key === 'status') {
          console.log(values[key], values[key] - 1 > -1 ? values[key] - 1 : 0);
          onChangeStatus(values[key], values[key] - 1 > -1 ? values[key] - 1 : 0);
        }
      });
    }
  }, [formik.values]);

  useEffect(() => {
    console.log(id);
  }, [id]);

  const onChangeCompleted = (index: number): void => {
    dispatch(boardsSlice.actions.setSubtaskCompleted({ index, taskIndex, colIndex }));
  };

  const onChangeStatus = (status: number | null, newColIndex: number | null): void => {
    dispatch(
      boardsSlice.actions.setTaskStatus({
        taskIndex,
        colIndex,
        newColIndex,
        status,
      })
    );
  };

  const onDeleteBtnClick = (e?: MouseEventHandler<HTMLButtonElement> | any): void => {
    if (e?.target?.textContent === 'Delete') {
      dispatch(boardsSlice?.actions?.deleteTask?.({ taskIndex, colIndex }));
      setDeleteModalOpen?.(false);
      setIsTaskModalOpen?.(false);
    } else {
      setDeleteModalOpen?.(false);
    }
  };

  const menuAction = (): IButtons[] => {
    return [
      {
        children: <FaEdit />,
        action: () => {
          setModalType?.(EDIT);
          setEditTaskModalOpen?.(true);
        },
        tooltip: 'action.edit',
      },
      {
        children: <FaRegTrashAlt />,
        customClass: 'p-1 ms-2',
        action: () => setDeleteModalOpen?.(true),
        tooltip: 'action.delete',
      },
    ];
  };

  return (
    <Modal setVisible={setIsTaskModalOpen} visible={isTaskModalOpen} title={`task`}>
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="modal-header">{task.title}</h1>

          <div className="d-flex">
            {menuAction()?.map((item, i) => (
              <Button
                key={`btn-modal-task-${i}`}
                handleClick={() => item?.action?.()}
                round={true}
                className="flat filled mid"
                customClass={item.customClass}
                tooltip={item.tooltip}
              >
                {item.children}
              </Button>
            ))}
          </div>
        </div>

        <p className="mt-3">{task.description}</p>

        <p className="mt-1">
          {t('content.subtasks')} ({completed} of {subtasks.length})
        </p>

        <div className="d-flex flex-column">
          {formConfig?.map((item, index) => (
            <div key={index} className="inputs-row">
              <FormElements
                key={`cell_${index}`}
                formControlName={item.formControlName}
                type={item.type}
                formik={formik}
                config={item.config}
              />
            </div>
          ))}
        </div>

        {isDeleteModalOpen && (
          <DeleteModal
            isDeleteModalOpen={isDeleteModalOpen}
            setDeleteModalOpen={setDeleteModalOpen}
            onDeleteBtnClick={onDeleteBtnClick}
            type="task"
            title={task.title}
          />
        )}

        {isEditTaskModalOpen && (
          <AddEditTaskModal
            setEditTaskModalOpen={setEditTaskModalOpen}
            isEditTaskModalOpen={isEditTaskModalOpen}
            type={modalType}
            taskIndex={taskIndex}
            prevColIndex={colIndex}
          />
        )}
      </div>
    </Modal>
  );
};

export default TaskModal;
