import { SetStateAction, Dispatch as ReactDispatch, MouseEventHandler } from 'react';
import { IButtons } from 'shared';
import Button from 'shared/components/Button';
import Modal from 'shared/components/Modal';
import { useTranslation } from 'react-i18next';

interface IProps {
  isTask?: boolean;
  title?: string;
  onDeleteBtnClick?: (e?: any) => void;
  isModalOpen?: boolean;
  setIsModalOpen?: ReactDispatch<SetStateAction<boolean>>;
}

const DeleteModal = ({ isTask, title, onDeleteBtnClick, isModalOpen, setIsModalOpen }: IProps) => {
  const { t } = useTranslation();
  const buttons = (): IButtons[] => {
    return [
      {
        children: 'Delete',
        action: (e: MouseEventHandler<HTMLButtonElement> | any): void => onDeleteBtnClick?.(e),
        tooltip: 'action.delete',
      },
      {
        children: 'Cancel',
        customClass: 'ms-2',
        action: (): void => setIsModalOpen?.(false),
        tooltip: 'action.cancel',
      },
    ];
  };

  return (
    <Modal setVisible={setIsModalOpen} visible={isModalOpen} title={`task`}>
      <h3 className="modal-header">{t('content.deleteTypeTitle', { value: title })}?</h3>
      {isTask ? (
        <p className="">{t('content.infoDeleteTask', { value: title })}</p>
      ) : (
        <p className="">{t('content.infoDeleteBoard', { value: title })}</p>
      )}

      <div className="d-flex">
        {buttons()?.map((item, i) => (
          <Button
            key={`btn-modal-task-${i}`}
            handleClick={e => item?.action?.(e)}
            className="flat filled"
            customClass={item.customClass}
            tooltip={item.tooltip}
          >
            {item.children}
          </Button>
        ))}
      </div>
    </Modal>
  );
};

export default DeleteModal;
