import React, { memo, MouseEventHandler, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { Tooltip } from 'primereact/tooltip';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';
import { confirmPopup } from 'primereact/confirmpopup';

export type TypeButton = 'button' | 'submit' | 'reset';
export type IButtonVariantTypes = 'primary' | 'secondary' | 'tertiary' | 'round';

export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  ROUND = 'round',
}

const { PRIMARY, SECONDARY, TERTIARY, ROUND } = ButtonVariant;

export interface IButtonComponent {
  id?: string;
  key?: string;
  name?: string;
  type?: TypeButton;
  children?: React.ReactNode;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  tooltip?: string;
  variant?: IButtonVariantTypes;
  buttonsConfig?: IButtonComponent[];
  configCustomClass?: string;
  size?: 'xs' | 'sm' | 'lg';
  selected?: boolean;
  showPopconfirm?: boolean;
}

const Button: React.FC<IButtonComponent> = (props) => {
  const { buttonsConfig, configCustomClass, variant } = props || {};
  const currentEventRef = useRef<React.MouseEvent<HTMLButtonElement> | null>(null);
  const { t } = useFallbackTranslation();

  const baseClasses = 'button-component';

  const variantClasses = useMemo(
    () => ({
      primary: PRIMARY,
      secondary: SECONDARY,
      tertiary: TERTIARY,
      round: 'round rounded-full',
    }),
    []
  );

  const disabledClasses = 'bg-gray text-disabled cursor-not-allowed';

  const buttonRender = (btn: IButtonComponent, index = 0): React.JSX.Element => {
    const sizeClasses = {
      xs: btn.variant === ROUND ? 'text-sm h-6 w-6' : 'text-sm px-2 py-1',
      sm: btn.variant === ROUND ? 'text-base h-8 w-8' : 'text-base px-3 py-2',
      lg: btn.variant === ROUND ? 'text-xl h-12 w-12' : 'text-lg px-4 py-3',
    };

    const buttonVariantClass = classNames(
      baseClasses,
      variantClasses[btn?.variant || 'primary'],
      sizeClasses[btn?.size || 'sm'],
      btn.disabled ? disabledClasses : '',
      btn.className,
      'target-tooltip'
    );

    const accept = () => {
      btn.handleClick?.(new MouseEvent('click') as unknown as React.MouseEvent<HTMLButtonElement>);
      currentEventRef.current = null;
    };

    const reject = () => {
      currentEventRef.current = null;
    };

    const confirmPopupTemplate = (event: React.MouseEvent<HTMLButtonElement>) => {
      currentEventRef.current = event;
      confirmPopup({
        target: event.currentTarget,
        message: (
          <div className="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
            <i className="pi pi-exclamation-circle text-6xl text-primary-500"></i>
            <span>{t('Please confirm to proceed.')}</span>
          </div>
        ),
        acceptIcon: 'pi pi-check',
        rejectIcon: 'pi pi-times',
        rejectClassName: 'p-button-sm confirmPopup-btn',
        acceptClassName: 'p-button-outlined p-button-sm confirmPopup-btn confirmPopup-btn-accept',
        accept,
        reject,
      });
    };

    return (
      <>
        <button
          key={`btn-${index}`}
          id={btn.id}
          type={btn.type || 'button'}
          onClick={(e) => (btn?.showPopconfirm ? confirmPopupTemplate(e) : btn.handleClick?.(e))}
          disabled={btn.disabled}
          aria-label={btn.ariaLabel ?? (btn.name ? t(btn.name) : '') ?? 'Unnamed Button'}
          className={`${buttonVariantClass} target-tooltip`}
          data-pr-tooltip={t(btn.tooltip || '')}
          data-pr-classname={`shadow-none`}
          data-pr-position="top"
        >
          {btn.name ? t(btn.name.toLowerCase()) : btn.children}
        </button>
      </>
    );
  };

  return (
    <>
      {!buttonsConfig?.length ? (
        buttonRender(props)
      ) : (
        <div className={configCustomClass ?? 'flex gap-x-2'}>{buttonsConfig?.map((btn, i) => buttonRender(btn, i))}</div>
      )}
    </>
  );
};

export default memo(Button);
