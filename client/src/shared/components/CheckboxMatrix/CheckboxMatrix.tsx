import { FC, forwardRef, useMemo } from 'react';
import { checkboxMatrixConfigDefault, ICheckboxMatrix } from './CheckboxMatrix.model';
import CheckboxMain from '../checkbox/CheckboxMain';
import Validator from '../validator/Validator';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';

interface IProps {
  name?: string;
  config?: Partial<ICheckboxMatrix>;
  value?: Record<string, string[]> | null;
  onChange?: (value: Record<string, string[]> | null) => void;
  error?: string | null | undefined;
  touched?: boolean;
}

const CheckboxMatrix = forwardRef<HTMLInputElement, IProps>(({ name, value, onChange, error, config }, ref) => {
  const { t } = useFallbackTranslation();

  const selectConfig = useMemo(() => ({ ...checkboxMatrixConfigDefault(), ...config }), [config]);

  const { dictData = [], disabled } = selectConfig || {};

  const handleCheckboxChange = (from: string, to: string) => {
    const current = value?.[from] ?? [];
    const exists = current?.indexOf(to) > -1;
    const updated = {
      ...value,
      [from]: exists ? current?.filter((v) => v !== to) : [...current, to],
    };

    onChange?.(updated);
  };

  const matrix = useMemo(() => {
    return dictData?.map(({ displayName: from }) => {
      return (
        <tr key={`row-${from}`}>
          <td>
            <span>{from}</span>
          </td>
          {dictData?.map(({ displayName: to }) => (
            <td key={`cell-${from}-${to}`}>
              <div className="d-flex align-items-center justify-content-center">
                {from === to ? (
                  <span>—</span>
                ) : (
                  <CheckboxMain
                    name={`${name}-${from?.toLowerCase()}-${to?.toLowerCase()}`}
                    value={(value?.[from ?? ''] ?? []).includes(to ?? '')}
                    onChange={() => handleCheckboxChange(from as string, to as string)}
                    tooltip={`${from ?? ''} → ${to ?? ''}`}
                    config={{ disabled, size: 'xs' }}
                  />
                )}
              </div>
            </td>
          ))}
        </tr>
      );
    });
  }, [dictData, value, disabled, onChange]);

  return (
    <div className="checkbox-matrix" ref={ref}>
      <table className="checkbox-matrix__table" id={name ?? ''}>
        <thead>
          <tr>
            <th>
              <span>Z / DO</span>
            </th>
            {dictData?.map(({ displayName: to }) => (
              <th key={`header-${to}`}>
                <span>{to}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{matrix}</tbody>
      </table>
      {error && <Validator error={t(error)} />}
    </div>
  );
});

export default CheckboxMatrix;
