import { Dialog, DialogProps } from 'primereact/dialog';
import { Dispatch, ReactNode, SetStateAction, useCallback, useMemo } from 'react';
import Button, { IButtonComponent } from './Button';
import { v4 as uuidv4 } from 'uuid';

interface IProps {
  title?: string;
  customClass?: string;
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  action: (key?: string) => void;
  children?: any;
  isDefaultButtons?: boolean;
}

const Modal = ({ title, customClass, visible, setVisible, action, isDefaultButtons = true, children }: IProps) => {
  const headerElement: ReactNode | DialogProps | any = useMemo(() => <h3 className="modal-title">{title}</h3>, [title]);

  const defautltButtons: IButtonComponent[] = [
    {
      name: 'buttons.save',
      key: 'SAVE',
      customClass: 'flat filled mr-2',
    },
    {
      name: 'buttons.cancel',
      key: 'CANCEL',
      customClass: 'filled',
    },
  ];

  const buttons: ReactNode[] | any[] = useMemo(() => defautltButtons, [isDefaultButtons]);

  const handleVidible = useCallback(() => {
    setVisible?.(false);
  }, []);

  return (
    <Dialog
      draggable={true}
      visible={visible}
      modal
      className="modal"
      headerClassName="modal-header"
      contentClassName="modal-content"
      header={headerElement}
      style={{ width: '50vw' }}
      onHide={handleVidible}
    >
      <div className="modal-body">
        {children}

        {isDefaultButtons ? (
          <div className="buttons-actions">
            {buttons?.map(btn =>
              btn?.key ? <Button key={uuidv4()} customClass={btn.customClass} name={btn.name} handleClick={() => action(btn.key)} /> : <></>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </Dialog>
  );
};

export default Modal;
