import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import ColumnsEditor, { ChildRefHandle } from './ColumnsEditor';
import { ISortableColumn } from './FormSortableColumns.model';
import Validator from '../validator/Validator';
import { IDictType, ISelect } from '../select/Select.model';
import Select from '../select/Select';
import Button, { ButtonVariant } from '../button/Button';
import PlusIcon from '../icons/PlusIcon';
import { FaUndo } from 'react-icons/fa';
import classNames from 'classnames';
import { getStatusDisplayName } from './FormSortableColumns.helper';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';
import { Skeleton } from 'primereact/skeleton';

interface IProps {
  name?: string;
  value?: ISortableColumn[];
  onChange?: (val: ISortableColumn[]) => void;
  error?: string | null;
  touched?: boolean;
  config?: Partial<ISelect>;
}

const FormSortableColumns = forwardRef<HTMLDivElement, IProps>(({ name, value = [], onChange, error, config = {} }, ref) => {
  const [columns, setColumns] = useState<ISortableColumn[]>(value);
  const [history, setHistory] = useState<ISortableColumn[][]>([]);
  const childRef = useRef<ChildRefHandle>(null);

  const { t } = useFallbackTranslation();

  const { disabled } = config || {};

  const availableOptions: IDictType[] = useMemo(() => {
    const statuses = ['TO_DO', 'IN_PROGRESS', 'CR', 'READY_FOR_TEST', 'TESTING', 'DONE'];
    return statuses.map((status) => ({ id: status, displayName: status.replace(/_/g, ' ') }));
  }, []);

  useEffect(() => {
    setColumns(value ?? []);
  }, [value]);

  useEffect(() => {
    if (disabled && ref && typeof ref !== 'function' && ref.current) {
      ref.current.classList.add('is-disabled');
    } else if (ref && typeof ref !== 'function' && ref.current) {
      ref.current.classList.remove('is-disabled');
    }
  }, [disabled]);

  const handleUpdate = (updated: ISortableColumn[]) => {
    setColumns(updated);
    onChange?.(updated);
  };

  const handlePickerChange = (selected: string | number | string[] | number[]) => {
    const selectedValues = Array.isArray(selected)
      ? selected.filter((v): v is string => typeof v === 'string')
      : typeof selected === 'string' || typeof selected === 'number'
        ? [selected.toString()]
        : [];

    const updated = [
      ...(columns?.filter((col) => selectedValues.indexOf(col.status) > -1)?.map((col) => ({ ...col, tempId: col.status })) ?? []),
      ...(selectedValues
        ?.filter((val) => !columns.some((c) => c.status === val))
        ?.map((status, index) => ({
          id: undefined,
          boardId: undefined,
          name: getStatusDisplayName(status),
          status: status as string,
          position: columns.length + index + 1,
          taskCount: 0,
          tempId: status as string,
        })) ?? []),
    ];
    handleUpdate(updated);
  };

  const handleClickAddColumn = () => {
    childRef.current?.handleAddColumn();
  };

  const handleClickHistoryUndo = () => {
    childRef.current?.handleHistoryUndo();
  };

  const selectedStatuses: string[] = useMemo(() => {
    return (
      (columns || []).map((col) => col.tempId).filter((el): el is string => !!el && availableOptions?.some((option) => option.id === el)) ??
      []
    );
  }, [columns]);

  const selectConfig = useMemo(
    () => ({ ...config, mode: 'multiple', dictData: availableOptions, placeholder: 'Wybierz kolumny do dodania' }) as Partial<ISelect>,
    [config]
  );

  return (
    <div className={classNames('sortable-columns', { 'is-disabled': disabled })} ref={ref}>
      <ColumnsEditor
        columns={columns}
        onUpdate={handleUpdate}
        history={history}
        setHistory={setHistory}
        disabled={disabled}
        ref={childRef}
      />

      <div className="d-flex flex-column gap-2">
        {selectConfig && selectedStatuses?.length >= 0 ? (
          <Select
            name={`formSortableColumns-item-select`}
            config={selectConfig}
            value={Array.isArray(selectedStatuses) ? selectedStatuses : []}
            onChange={handlePickerChange}
          />
        ) : (
          <Skeleton height="2rem" />
        )}
        <div className="d-flex justify-content-center gap-2">
          <Button handleClick={handleClickAddColumn} variant={ButtonVariant.ROUND} size="sm" tooltip="Dodaj kolumnę" disabled={disabled}>
            <PlusIcon />
          </Button>
          <Button
            handleClick={handleClickHistoryUndo}
            variant={ButtonVariant.ROUND}
            size="sm"
            disabled={history.length === 0 || disabled}
            tooltip="Cofnij zmiany"
          >
            <FaUndo />
          </Button>
        </div>
      </div>
      {error && <Validator error={t(error)} />}
    </div>
  );
});

export default FormSortableColumns;
