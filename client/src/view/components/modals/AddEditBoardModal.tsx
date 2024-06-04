import { useState, Dispatch as ReactDispatch, SetStateAction, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'shared/components/Modal';
import boardsSlice from 'store/dataSlice';
import { IButtons, MODAL_TYPE } from 'shared';
import { FaMinus } from 'react-icons/fa';
import Button, { IButtonComponent } from 'shared/components/Button';
import { FormikProps, useFormik } from 'formik';
import { IFormElements } from 'shared/components/formElements/FormElements.model';
import { arrayMove, createConfigForm, toCamelCase } from 'shared/utils/helpers';
import { IRootState } from 'store/store';
import { IBoard, IColumns } from 'store/data.model';
import FormElements from 'shared/components/formElements/FormElements';
import { boardDefault, formConfigDefault } from './Form.config';
import { DragDropContext, Draggable, DropResult, Droppable, OnDragEndResponder } from '@hello-pangea/dnd';
import { editBoardAction, setNewBoardAction } from 'store/actions/bordsActions';

const { ADD, EDIT } = MODAL_TYPE;

interface IProps {
  setIsBoardModalOpen?: ReactDispatch<SetStateAction<boolean>>;
  isBoardModalOpen?: boolean;
  type?: string;
}

const AddEditBoardModal = ({ isBoardModalOpen, setIsBoardModalOpen, type }: IProps) => {
  const [formConfig, setFormConfig] = useState<IFormElements[]>([]);
  const [editColumns, setEditColumns] = useState<IColumns[]>([]);
  const dispatch = useDispatch();
  const boards: IBoard[] = useSelector((state: IRootState) => state?.dataSlice?.boards ?? []) ?? [];
  const board: IBoard = boards?.find(board => board.isActive) ?? {};
  const columns = board?.columns?.map(e => e)?.sort((a, b) => a?.position - b?.position) ?? [];

  const formik: FormikProps<any> = useFormik({
    initialValues: {},
    onSubmit: () => {},
  });

  useEffect(() => {
    let initalValues: any = boardDefault;
    if (type === ADD) {
      formik.setValues(initalValues, true);
    } else {
      initalValues = {};
      columns?.forEach((el, i) => {
        initalValues[`${toCamelCase(uuidv4())}${i}`] = el.name ?? '';
      });

      formik.setValues({ boardName: board?.name ?? null, ...initalValues });
    }
  }, []);

  useEffect(() => {
    setConfig();
  }, [Object.keys(formik?.values)?.length]);

  useEffect(() => {
    console.log(formConfig);
  }, [formConfig]);

  const setConfig = (): void => {
    let config: IFormElements = formConfigDefault();
    Object.keys(formik?.values)?.forEach(key => {
      if (key !== 'boardName') {
        config[key] = {};
      }
    });
    setFormConfig(createConfigForm(config, { prefix: 'form', isNoPlaceholderAll: true, isHeaderAll: false }));
  };

  const handleNewColumns = (): void => {
    formik.setFieldValue(toCamelCase(uuidv4()), null);
  };

  const onDelete = (key: string): void => {
    formik.setFieldValue(key, undefined);
  };

  const onSubmit = (type: string): void => {
    const name = formik.values.boardName;
    setIsBoardModalOpen?.(false);
    const payload = { name };
    const newColumns: IColumns[] = [];
    formConfig
      ?.filter(el => el.formControlName !== 'boardName')
      ?.forEach((el, i) => {
        if (el.formControlName !== 'boardName') {
          const oldData = type === EDIT ? columns?.find(el => el?.position === i) : {};
          newColumns.push({ ...oldData, name: formik.values[el.formControlName], position: i });
        } else {
          payload.name = formik.values['boardName'];
        }
      });
    if (type === ADD) {
      dispatch(setNewBoardAction({ ...payload, isActive: false, columns: newColumns }, dispatch));
    } else {
      dispatch(editBoardAction(board?.id as string, { ...payload, isActive: false, columns: newColumns }, dispatch));
    }
  };

  const onDragEnd: OnDragEndResponder = (result: DropResult): void => {
    const { destination, source } = result || {};
    setFormConfig(() => arrayMove(formConfig, source?.index + 1, (destination?.index as number) + 1));
  };

  const buttonsRender = (): JSX.Element | JSX.Element[] => {
    const buttons: IButtonComponent[] = [
      {
        children: '+ Add New Column',
        className: 'flat filled',
        handleClick: () => handleNewColumns(),
      },
      {
        children: type === ADD ? 'Create New Board' : 'Save Changes',
        className: 'flat filled',
        customClass: 'ml-4',
        disabled: !formik.isValid,
        handleClick: () => (formik.isValid ? onSubmit?.(type as string) : null),
      },
    ];

    return buttons?.map((el, i) => (
      <Button
        key={i}
        handleClick={() => el?.handleClick?.()}
        className={el.className ?? ''}
        customClass={el.customClass ?? ''}
        round={el.round ?? false}
        disabled={el.disabled ?? false}
      >
        {el.children}
      </Button>
    ));
  };

  return (
    <Modal setVisible={setIsBoardModalOpen} visible={isBoardModalOpen} title={`${formik.values.boardName} - ${type} Board`}>
      <form className="board-modal">
        <div className="d-block w-100">
          {formConfig
            ?.filter(el => el.formControlName === 'boardName')
            ?.map((item, index) => (
              <div key={index} className="items">
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

        <div className="d-flex flex-column">
          <h3 className="content-header mt-1">Board Columns</h3>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`d-flex flex-column  ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
                >
                  {formConfig
                    ?.filter(el => el.formControlName !== 'boardName')
                    ?.map((item, index) => (
                      <Draggable key={item.formControlName} draggableId={item.formControlName} index={index}>
                        {provided => (
                          <div
                            key={index}
                            className="inputs-row"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <FormElements
                              key={`cell_${index}`}
                              formControlName={item.formControlName}
                              type={item.type}
                              formik={formik}
                              config={item.config}
                            />

                            <Button handleClick={() => onDelete(item.formControlName)} className="flat filled small ms-2" round={true}>
                              <FaMinus />
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div className="d-flex justify-content-center mt-3">{buttonsRender()}</div>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditBoardModal;
