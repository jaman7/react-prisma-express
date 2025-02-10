import FormElements from '@/shared/components/formElements/FormElements';
import Modal from '@/shared/components/Modal';
import { ButtonsKeys, MODAL_TYPE } from '@/shared/enums';
import { IModal } from '@/shared/model';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { IFormElements } from '@/shared/components/formElements/FormElements.model';
import { createConfigForm } from '@/shared/utils/form-config';
import { formUserModalConfig, translatePrefix } from './ProjectsEditModal.config';
import { IProject } from '../Projects.model';
import HttpService from '@/core/http/http.service';

interface IProps {
  modal?: IModal;
  setVisible?: (e: boolean) => void;
}

const { ADD, EDIT, VIEW } = MODAL_TYPE;
const { SAVE, CANCEL } = ButtonsKeys;

const http = new HttpService();

const ProjectsEditModal = ({ setVisible, modal }: IProps) => {
  const [formConfig, setFormConfig] = useState<IFormElements[]>([]);
  const [data, setData] = useState<IProject>({});

  useEffect(() => {
    setFormConfig(createConfigForm(formUserModalConfig(), { prefix: translatePrefix }));
  }, [modal?.visible]);

  const onClick = (key: any) => {
    switch (key) {
      case SAVE:
        // sendSettings(id as number, { ...data, ...formik.values });
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
      visible={modal?.visible}
      // title={modalTitle()}
      action={onClick}
      isDefaultButtons={modal?.type === ADD || modal?.type === EDIT}
    >
      {/* <form className="board-modal">
        {config?.map((item, i) => (
          <div key={`cell-${i}`} className="items">
            <FormElements formControlName={item.formControlName} type={item.type} formik={formik} config={item.config} />
          </div>
        ))}
      </form> */}
    </Modal>
  );
};

export default ProjectsEditModal;
