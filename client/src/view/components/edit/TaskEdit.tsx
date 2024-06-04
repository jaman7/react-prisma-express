import { SetStateAction, Dispatch as ReactDispatch, useState } from 'react';
import Modal from 'shared/components/Modal';
import { IBoardTask } from 'store/data.model';
import DefaultsActionButtons from './DefaultsActionButtons';

interface IProps {
  task?: IBoardTask;
  setIsTaskModalOpen?: ReactDispatch<SetStateAction<boolean>>;
  isTaskModalOpen?: boolean;
}

const TaskEdit = ({ task, setIsTaskModalOpen, isTaskModalOpen }: IProps) => {
  const [isSave, setSave] = useState<boolean>(false);
  const [isCancel, setCancel] = useState<boolean>(false);

  return (
    <>
      <Modal setVisible={setIsTaskModalOpen} visible={isTaskModalOpen} title={`task`}>
        <DefaultsActionButtons setSave={setSave} setCancel={setCancel} />
      </Modal>
    </>
  );
};

export default TaskEdit;
