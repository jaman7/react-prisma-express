import { SetStateAction, Dispatch as ReactDispatch } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared/components/Button';

interface IProps {
  setSave?: ReactDispatch<SetStateAction<boolean>>;
  setCancel?: ReactDispatch<SetStateAction<boolean>>;
}

const DefaultsActionButtons = ({ setSave, setCancel }: IProps) => {
  const { t } = useTranslation();
  return (
    <div className="d-flex justify-content-center pt-3">
      <Button className="flat filled small ms-2" handleClick={() => setSave?.(true)}>
        {t('action.save')}
      </Button>
      <Button className="flat filled small ms-2" handleClick={() => setCancel?.(true)}>
        {t('action.cancel')}
      </Button>
    </div>
  );
};

export default DefaultsActionButtons;
