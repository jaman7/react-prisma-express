import { Dialog, DialogProps } from 'primereact/dialog';
import { Dispatch, ReactNode, SetStateAction, useCallback, useMemo } from 'react';
import Button, { ButtonVariant, IButtonComponent } from './button/Button';
import { ButtonsKeys } from '../enums';

interface IProps {
  title?: string;
  customClass?: string;
  visible?: boolean;
  setVisible?: (e: boolean) => void;
  action: (key?: string) => void;
  children?: any;
  isDefaultButtons?: boolean;
}

const { PRIMARY, SECONDARY } = ButtonVariant;
const { SAVE, CANCEL } = ButtonsKeys;

const Modal: React.FC<IProps> = ({ title, customClass, visible, setVisible, action, isDefaultButtons = true, children }) => {
  const headerElement = useMemo(() => <h3 className="modal-title">{title}</h3>, [title]);

  const defautltButtons: IButtonComponent[] = [
    {
      name: 'buttons.save',
      key: SAVE,
      variant: PRIMARY,
    },
    {
      name: 'buttons.cancel',
      key: CANCEL,
      variant: SECONDARY,
    },
  ];

  const buttons: ReactNode[] | any[] = useMemo(() => defautltButtons, [isDefaultButtons]);

  const handleHide = useCallback(() => {
    setVisible?.(false);
  }, [setVisible]);

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
      onHide={handleHide}
    >
      <div className="modal-body">
        {children}

        {isDefaultButtons ? (
          <div className="buttons-actions">
            {buttons?.map((btn, i) =>
              btn?.key ? <Button key={`modal-btn-${i}`} variant={btn.variant} name={btn.name} handleClick={() => action(btn.key)} /> : <></>
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
