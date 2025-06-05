import { Dialog } from 'primereact/dialog';
import { useCallback, useMemo } from 'react';
import Button, { ButtonVariant, IButtonComponent } from './button/Button';
import { IoClose } from 'react-icons/io5';
import { ButtonsKeys } from '../enums';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';
import classNames from 'classnames';

interface IProps {
  title?: string;
  customClass?: string;
  visible?: boolean;
  setVisible?: (e: boolean) => void;
  action: (key?: string) => void;
  children?: any;
  isDefaultButtons?: boolean;
  isSaveEnabled?: boolean;
}

const { PRIMARY, SECONDARY } = ButtonVariant;
const { SAVE, CANCEL } = ButtonsKeys;

const Modal: React.FC<IProps> = ({
  title = '',
  customClass,
  visible,
  setVisible,
  action,
  isDefaultButtons = true,
  isSaveEnabled,
  children,
}) => {
  const { t } = useFallbackTranslation();

  const defautltButtons: IButtonComponent[] = [
    {
      name: 'common.buttons.save',
      key: SAVE,
      variant: PRIMARY,
      disabled: !isSaveEnabled,
    },
    {
      name: 'common.buttons.cancel',
      key: CANCEL,
      variant: SECONDARY,
    },
  ];

  const buttons: IButtonComponent[] = useMemo(() => [...defautltButtons], [isDefaultButtons, isSaveEnabled]);

  const headerTemplate = useCallback(
    () => (
      <div className="d-flex align-items-center justify-content-center gap-2">
        <h3 className="modal-title">{t(title)}</h3>
      </div>
    ),
    [title]
  );

  const footerTemplate = useCallback(() => {
    if (!isDefaultButtons) return <></>;
    return (
      <div className={classNames('buttons-actions', { 'p-2': isSaveEnabled, 'p-0': !isSaveEnabled })}>
        {buttons?.map((btn, i) =>
          btn?.key ? (
            <Button
              key={`modal-btn-${i}`}
              variant={btn.variant}
              name={btn.name}
              disabled={btn.disabled}
              handleClick={() => action(btn.key)}
            />
          ) : (
            <></>
          )
        )}
      </div>
    );
  }, [action, isSaveEnabled]);

  return (
    <Dialog
      draggable={true}
      visible={visible}
      modal
      className={classNames('modal', customClass)}
      headerClassName="modal-header"
      contentClassName="modal-content"
      style={{ width: '50vw' }}
      onHide={() => {
        if (!visible) return;
        setVisible?.(false);
      }}
      header={headerTemplate}
      footer={footerTemplate}
      closeIcon={<IoClose />}
    >
      <div className="modal-body">{children}</div>
    </Dialog>
  );
};

export default Modal;
