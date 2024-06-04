import { Tooltip } from 'primereact/tooltip';
import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

export interface IButtonComponent {
  name?: any;
  key?: string;
  children?: any;
  className?: string;
  customClass?: string;
  handleClick?: (e?: MouseEventHandler<HTMLButtonElement> | any) => void;
  type?: string;
  round?: boolean;
  disabled?: boolean;
  tooltip?: string;
  buttonsConfig?: IButtonComponent[];
}

const Button = (props: IButtonComponent) => {
  const { buttonsConfig } = props || {};

  const { t } = useTranslation();

  const buttonRender = (btn: IButtonComponent, index = 0): JSX.Element | JSX.Element[] | undefined => {
    return (
      <>
        <Tooltip target=".target-tooltip" />
        <button
          key={uuidv4()}
          className={`button-component target-tooltip ${btn?.className ?? 'default-button'} ${btn?.customClass ?? ''} ${buttonsConfig?.length && index > 0 ? 'ms-2' : ''} ${btn?.round ? 'round' : ''}`}
          onClick={(e?: MouseEventHandler<HTMLButtonElement> | any) => btn?.handleClick?.(e)}
          type={btn?.type !== null ? 'button' : btn?.type}
          disabled={btn?.disabled ?? false}
          data-pr-tooltip={t(btn?.tooltip as string)}
          data-pr-classname="button-tooltip"
          data-pr-position="top"
        >
          {btn?.name ? t(btn?.name.toLowerCase()) : btn?.children}
        </button>
      </>
    );
  };

  return (
    <>
      {!buttonsConfig?.length ? (
        buttonRender?.(props as IButtonComponent)
      ) : buttonsConfig?.length > 0 ? (
        <div className={`d-flex`}>{buttonsConfig?.map((btn, i) => buttonRender?.(btn as IButtonComponent, i))}</div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Button;
