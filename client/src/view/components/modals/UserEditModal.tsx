import { useEffect, useState, Dispatch as ReactDispatch, SetStateAction, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import LetteredAvatar from 'shared/components/LetteredAvatar';
import Modal from 'shared/components/Modal';
import { IFormElements } from 'shared/components/formElements/FormElements.model';
import { MODAL_TYPE } from 'shared/enums/modal';
import { IModalType } from 'shared/model/modal';
import HttpService from 'shared/services/http/http.service';
import { createConfigForm } from 'shared/utils/helpers';
import dataSlice from 'store/dataSlice';
import { formUserModalConfig } from './Form.config';
import FormElements from 'shared/components/formElements/FormElements';
import { FormikProps, useFormik } from 'formik';
import { ButtonsKeys } from 'shared/enums/buttons';

interface IProps {
  id?: number;
  type?: IModalType;
  visible?: boolean;
  setVisible?: ReactDispatch<SetStateAction<boolean>>;
}

const { ADD, EDIT, VIEW } = MODAL_TYPE;
const { SAVE, CANCEL } = ButtonsKeys;

const UserEditModal = ({ setVisible, visible, type, id }: IProps) => {
  const [modalType, setModalType] = useState<IModalType>('EDIT');
  const [data, setData] = useState<any>({});
  const [formConfig, setFormConfig] = useState<IFormElements[]>([]);
  const dispatch = useDispatch();
  const { setIsLoading } = dataSlice.actions;
  const { t } = useTranslation();
  const { name, lastName } = data || {};
  const http = new HttpService();

  const translatePrefix = 'userProfile.modal';

  const formik: FormikProps<any> = useFormik({
    initialValues: { name: null },
    onSubmit: () => {},
  });

  useEffect(() => {
    setModalType(type as IModalType);
  }, [type]);

  useEffect(() => {
    setFormConfig(createConfigForm(formUserModalConfig(), { prefix: translatePrefix, isDisableAll: modalType === VIEW }));
  }, [modalType]);

  useEffect(() => {
    if (modalType === VIEW || modalType === EDIT) {
      fetchUser(id as number);
    }
  }, [id, modalType]);

  const fetchUser = (id: number) => {
    dispatch(setIsLoading(true));
    http
      .service()
      .get('/user/' + id)
      .then(user => {
        setData(user);
        formik.setValues(user);
        dispatch(setIsLoading(false));
      })
      .catch(() => {
        dispatch(setIsLoading(false));
      });
  };

  const sendSettings = (id: number, data) => {
    console.log(data);
    // dispatch(setIsLoading(true));

    // http
    //   .service()
    //   .get('/user/' + id)
    //   .then(user => {
    //     setData(user);
    //     formik.setValues(user);
    //     dispatch(setIsLoading(false));
    //   })
    //   .catch(() => {
    //     dispatch(setIsLoading(false));
    //   });
  };

  const config = useMemo(() => formConfig, [formConfig]);

  const modalTitle = (): string =>
    useMemo(() => {
      const fullName = (modalType === VIEW || modalType === EDIT) && name && lastName ? `${name} ${lastName}` : '';
      return t(translatePrefix + '.' + modalType?.toLowerCase(), { value: `${fullName}` });
    }, [name, lastName, modalType]);

  const logo = (): JSX.Element => useMemo(() => <LetteredAvatar name={`${name} ${lastName}`} />, [name, lastName]);

  const onClick = (key: any) => {
    switch (key) {
      case SAVE:
        sendSettings(id as number, { ...data, ...formik.values });
        break;
      case CANCEL:
        setVisible?.(false);
        break;
      default:
        break;
    }
  };

  return (
    <Modal
      setVisible={setVisible}
      visible={visible}
      title={modalTitle()}
      action={onClick}
      isDefaultButtons={modalType === ADD || modalType === EDIT}
    >
      <div className="modal-user-admin">
        {logo()}

        <form className="board-modal">
          {config?.map((item, i) => (
            <div key={`cell-${i}`} className="items">
              <FormElements formControlName={item.formControlName} type={item.type} formik={formik} config={item.config} />
            </div>
          ))}
        </form>
      </div>
    </Modal>
  );
};

export default UserEditModal;
