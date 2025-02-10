import { format, parseISO } from 'date-fns';
import { IDictionary } from '../components/select/Select.model';
import { ILazyState, ITableColumns, ITableColumnsType } from '../components/table/table.model';
import { DATE_TIME_FORMAT } from '../enums';
import { IParams } from '@/core/http/http.models';
import { SortingFiltersTableEnum } from '../components/table/table.enum';

const { ASC, DESC, ID_DESC } = SortingFiltersTableEnum;

export const createTableColumnsConfig = (
  config: {
    [name: string]: ITableColumns;
  },
  params: {
    prefix?: string;
    dict?: IDictionary;
  } = {}
): ITableColumns[] => {
  const { prefix, dict } = params || {};
  return Object.keys(config)?.map((key) => {
    const { FNS_DATE } = DATE_TIME_FORMAT;
    const {
      dictName,
      type: colType,
      sortField,
      sortable,
      formatDate,
      customHeader,
      userLogoSize,
      filterType,
      filter,
      ...rest
    } = config?.[key] ?? {};
    const dictionaryName = dictName ?? key;
    const dictionary = dict?.[dictionaryName] ?? [];
    const header = customHeader ?? `${prefix ?? 'table'}.${key}`;
    const type: ITableColumnsType = colType ?? ('text' as ITableColumnsType);
    const column: ITableColumns = {
      ...rest,
      type,
      header,
      field: key,
      sortField: sortField ?? key,
      sortable: sortable !== undefined ? sortable : true,
      dictionary,
      formatDate: formatDate ?? FNS_DATE ?? '',
      userLogoSize: userLogoSize ?? 30,
      filter: { ...filter, type: filter?.type ?? filterType },
      customizeValue: (val) => {
        if (type === 'DateTime') {
          return format(parseISO(val as string), formatDate ?? FNS_DATE ?? '');
        }
        return val;
      },
    };

    return column;
  });
};

export function setTableParams(event: ILazyState, deafultSort: string = ID_DESC): IParams {
  const tableParam: IParams | any = {};
  const { page, pageSize, sortOrder, sortBy: sortField, filters } = event;

  tableParam.page = page;
  tableParam.pageSize = pageSize;
  tableParam.sortBy = sortField ?? '';
  tableParam.sortOrder = sortOrder;

  if (filters && Object.keys(filters)?.length) {
    Object.entries(filters)?.forEach(([key, data]) => {
      const { value } = data || {};
      if (value !== null) {
        if (typeof value !== 'string' || value.length >= 1) {
          tableParam[key] = value;
        } else {
          delete tableParam[key];
        }
      } else if (tableParam[key]) {
        delete tableParam[key];
      }
    });
  }

  if (!tableParam?.sortBy || tableParam.sortBy === '') delete tableParam.sortBy;
  if (!tableParam?.sortOrder) delete tableParam.sortOrder;

  return tableParam;
}
