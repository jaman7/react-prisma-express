import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Validator from '../validator/Validator';
import classNames from 'classnames';
import { IUserAssignEdit, userAssignEditConfigDefault } from './UserAssignEdit.model';
import LetteredAvatar from '../LetteredAvatar';
import { PickList } from 'primereact/picklist';
import { IDictType } from '../select/Select.model';
import { SortingFiltersTableEnum } from '../table/table.enum';
import { splitDictByValue } from '@/shared/utils/dictionary';
import { areArraysEqual } from '@/shared/utils/array-utils';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';

const { ASC } = SortingFiltersTableEnum;

interface IProps {
  name?: string;
  value?: string[];
  onChange?: (val: string[]) => void;
  error?: string | null;
  touched?: boolean;
  config?: Partial<IUserAssignEdit>;
}

const UserAssignEdit = forwardRef<HTMLDivElement, IProps>(({ name, value, onChange, error, config = {} }, ref) => {
  const [source, setSource] = useState<IDictType[]>([]);
  const [target, setTarget] = useState<IDictType[]>([]);

  const prevValueRef = useRef<string[] | undefined>([]);

  const { t } = useFallbackTranslation();

  const { picklistRows } = config || {};

  const selectConfig = useMemo(() => ({ ...userAssignEditConfigDefault(), ...config, setHeight: (picklistRows ?? 8) * 24 }), [config]);

  const { disabled, dictData, userLogoSize, isPicklist } = selectConfig || {};

  const maxHeight = (): string => `${selectConfig.setHeight}px`;

  useEffect(() => {
    const hasChanged = !areArraysEqual(prevValueRef.current, value || undefined);

    if (dictData && value && hasChanged) {
      setTarget(splitDictByValue(dictData, value, false));
      setSource(splitDictByValue(dictData, value));
      prevValueRef.current = value;
    } else if (dictData && value?.length === 0) {
      setSource(splitDictByValue(dictData, value));
      setTarget([]);
    }
  }, [dictData, value]);

  const handleChange = ({ source = [], target = [] }) => {
    setSource(source ?? []);
    setTarget(target ?? []);

    const ids = target?.map(({ id }: { id: string | undefined }) => id)?.filter((id): id is string => typeof id === 'string') ?? [];
    if (!areArraysEqual(value ?? [], ids)) {
      onChange?.(ids);
    }
  };

  const itemTemplate = useCallback(
    (item: IDictType) => (
      <>
        <LetteredAvatar name={item?.displayName ?? ''} size={20} />
        <span className="font-bold text-900">{item?.displayName ?? ''}</span>
      </>
    ),
    []
  );

  return (
    <div className={classNames('user-assign d-flex flex-column flex-wrap gap-2', { disabled: disabled })} ref={ref}>
      <div className="d-flex flex-wrap gap-2">
        {target?.map((item, index) => (
          <LetteredAvatar key={index} name={item?.displayName ?? ''} size={userLogoSize} tooltipText={item?.displayName ?? ''} />
        ))}
      </div>

      {isPicklist && (
        <>
          <PickList
            className="pick-list"
            dataKey="id"
            filterBy="displayName"
            sourceStyle={{ height: maxHeight(), minHeight: maxHeight() }}
            targetStyle={{ height: maxHeight(), minHeight: maxHeight() }}
            sourceHeader={t('common.pickList.accessible')}
            targetHeader={t('common.pickList.selected')}
            source={source}
            target={target}
            onChange={handleChange}
            showSourceControls={false}
            showTargetControls={false}
            itemTemplate={(item) => itemTemplate(item)}
            breakpoint="800px"
            aria-label="User assignment picklist"
          />

          {error && <Validator error={t(error)} />}
        </>
      )}
    </div>
  );
});

export default memo(
  UserAssignEdit,
  (prev, next) => JSON.stringify(prev.value) === JSON.stringify(next.value) && JSON.stringify(prev.config) === JSON.stringify(next.config)
);
