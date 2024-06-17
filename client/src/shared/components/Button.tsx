import { Tooltip } from 'primereact/tooltip';
import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { classNames } from 'primereact/utils';

export interface IButtonComponent {
  name?: string;
  key?: string;
  children?: React.ReactNode;
  className?: string;
  customClass?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  round?: boolean;
  disabled?: boolean;
  tooltip?: string;
  buttonsConfig?: IButtonComponent[];
}

const Button = (props: IButtonComponent) => {
  const { buttonsConfig } = props || {};
  const { t } = useTranslation();

  const buttonRender = (btn: IButtonComponent, index = 0): JSX.Element => {
    const buttonClassNames = classNames('button-component', 'target-tooltip', btn.className || 'default-button', btn.customClass, {
      'ms-2': buttonsConfig?.length && index > 0,
      round: btn.round,
      isDisabled: btn.disabled,
    });

    return (
      <button
        key={uuidv4()}
        className={buttonClassNames}
        onClick={btn.handleClick}
        type={btn.type || 'button'}
        disabled={btn.disabled}
        data-pr-tooltip={t(btn.tooltip || '')}
        data-pr-classname="button-tooltip"
        data-pr-position="top"
      >
        {btn.name ? t(btn.name.toLowerCase()) : btn.children}
      </button>
    );
  };

  return (
    <>
      <Tooltip target=".target-tooltip" />
      {!buttonsConfig?.length ? buttonRender(props) : <div className="d-flex">{buttonsConfig.map((btn, i) => buttonRender(btn, i))}</div>}
    </>
  );
};

export default Button;
