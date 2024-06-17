import { useEffect, useRef } from 'react';
import { isEqual } from 'lodash';
import { IFormElements } from '../components/formElements/FormElements.model';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { DATE_TIME_FORMAT } from 'shared/enums';

export const mathSubtraction = (a: number | null, b: number, isIncrement = true): number => {
  const a1 = a?.toString()?.split('.');
  let a1Max = 0;
  if (a1?.length === 2) {
    a1Max = a1?.[1]?.length ?? 0;
  }
  const b1 = b?.toString()?.split('.');
  let b1Max = 0;
  if (b1.length === 2) {
    b1Max = b1?.[1]?.length ?? 0;
  }
  const maxLen = a1Max > b1Max ? a1Max : b1Max;
  const isXNumber = (x: number): number => (x !== null && x !== undefined && !Number.isNaN(x) ? x : 0);

  if (isIncrement) {
    const sum = isXNumber(a) + isXNumber(b);
    return sum !== 0 && !Number.isNaN(sum) ? Number(parseFloat(sum.toString()).toFixed(maxLen)) : 0;
  }
  const subtraction = isXNumber(a) - isXNumber(b);
  return subtraction !== 0 && !Number.isNaN(subtraction) ? Number(parseFloat(subtraction.toString()).toFixed(maxLen)) : 0;
};

export const isNumeric = (value: string | number | null): boolean => {
  if (typeof value !== 'string') {
    return false;
  }
  return !Number.isNaN(value) && !Number.isNaN(parseFloat(value));
};

export const createConfigForm = (
  formConfig: IFormElements,
  params: {
    prefix?: string;
    dictionaries?: any;
    isNoPlaceholderAll?: boolean;
    isHeaderAll?: boolean;
    isDisableAll?: boolean;
  } = {}
): IFormElements[] => {
  return (
    Object.keys(formConfig)?.map((key: string) => {
      const { prefix, dictionaries, isNoPlaceholderAll, isHeaderAll, isDisableAll } = params || {};
      const { config } = formConfig?.[key] ?? {};
      const {
        placeholder,
        isNoPlaceholder,
        type,
        formCellType,
        step,
        min,
        max,
        dictName,
        dictData,
        header,
        isHeader,
        value,
        formCellClass,
        disabled,
      } = (config as IFormElements) || {};

      return {
        formControlName: key,
        type,
        config: {
          ...(config ?? {}),
          prefix,
          header: header ?? `${prefix}.${key}`,
          formCellType: !value ? formCellType ?? 'input' : null,
          placeholder: isNoPlaceholder || isNoPlaceholderAll ? '' : placeholder ?? `${prefix}.${key}`,
          step: step ?? 1,
          min: min ?? 0,
          max: max ?? 100000,
          dictName: dictName ?? key,
          dictData: dictData ?? dictionaries?.[dictName ?? key] ?? [],
          isHeader: typeof isHeader !== 'boolean' && typeof isHeaderAll !== 'boolean' ? true : isHeader || isHeaderAll,
          formCellClass: formCellClass ?? '',
          disabled: isDisableAll ?? disabled ?? false,
        },
      };
    }) ?? []
  );
};

export const usePrevious = (value: any): any => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const ifChanged = (prev: any, next: any, callback: (value: any) => void): void => {
  if (!isEqual(prev, next)) {
    callback(true);
  }
};

export const getChangedValues = <T extends Record<string, any>>(values: T, initialValues: T) => {
  return Object.entries(values).reduce((acc: Partial<T>, [key, value]) => {
    const hasChanged = initialValues[key as keyof T] !== value;
    if (hasChanged) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {});
};

export const toCamelCase = (text: string): string => {
  const tmpText = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
  return tmpText.substring(0, 1).toLowerCase() + tmpText.substring(1);
};

export const arrayMove = (arr: any[], oldIndex: number, newIndex: number): any[] => {
  if (newIndex >= arr?.length) {
    var k = newIndex - arr?.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr?.splice(newIndex, 0, arr?.splice(oldIndex, 1)[0]);
  return arr;
};

export const dateFormat = (date: string, format: string): string => moment(date).format(format);

export const momentDate = (date: moment.MomentInput): Date => moment(date).toDate();

export const handleRedirect = (path: string) => {
  const nawigate = useNavigate();
  nawigate(path);
};

export const dateIsoLocal = (date: string | null): Date | string | null => {
  const isoDate = date ? new Date(date)?.toISOString() : null;
  return isoDate ? dateFormat(isoDate, DATE_TIME_FORMAT.MOMENT_DATE_T_TIME) : null;
};

export const parseDateString = (dateString: string): Date => {
  return new Date(dateString);
};
