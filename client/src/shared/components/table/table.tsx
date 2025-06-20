import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { DataTable, DataTableFilterMetaData, DataTableStateEvent, DataTableValue } from 'primereact/datatable';
import { icons } from './table.icons';
import { ITableColumns, ITableColumnsType, ITableIconsType, ITableButtonAction, ILazyState } from './table.model';
import {
  startTransition,
  useCallback,
  Suspense,
  ReactNode,
  useEffect,
  useRef,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import Button, { ButtonVariant } from '../button/Button';
import { ButtonsKeys, ButtonsTranslate } from '@/shared/enums';
import React from 'react';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import LetteredAvatar from '../LetteredAvatar';
import { FilterMatchMode } from 'primereact/api';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';
import { IModalButtonsType } from '@/shared/model';

interface TableProps {
  action: (e?: ITableButtonAction) => void;
  buttonsIcons?: ITableIconsType[];
  columns?: ITableColumns[];
  value?: DataTableValue[];
  paginator?: boolean;
  lazy?: boolean;
  totalRecords?: number;
  isColumnAction?: boolean;
  allowFilters?: boolean;
  quantity?: number;
  range?: number[];
  onLazyLoad?: (event: ILazyState) => void;
}

export interface TableRef {
  reset: () => void;
  reload: () => void;
}

const Table = forwardRef<TableRef, TableProps>((props, ref) => {
  const {
    columns = [],
    value,
    buttonsIcons = [],
    paginator = true,
    totalRecords = 0,
    isColumnAction = false,
    allowFilters = false,
    quantity = 10,
    range = [10, 50, 10],
    lazy = false,
    action,
    onLazyLoad,
  } = props;

  const [lazyState, setlazyState] = useState<ILazyState>({
    filters: {},
    sort: { field: '', order: null },
    page: 0,
    pageSize: quantity,
  });

  const globalFilterFields = useMemo(() => columns?.map((column) => column.field || '')?.filter(Boolean), [columns]);
  const { t } = useFallbackTranslation();
  const lazyLoadSubject = useRef(new Subject<ILazyState>()).current;
  const rowPerPageOptions = Array.from({ length: (range[1] - range[0]) / range[2] + 1 }, (_, index) => range[0] + index * range[2]);

  const triggerLazyLoad = useCallback(() => {
    if (lazy && onLazyLoad) {
      lazyLoadSubject.next({
        sortBy: lazyState?.sort?.field ?? '',
        sortOrder: lazyState?.sort?.order === 1 ? 'asc' : 'desc',
        filters: lazyState?.filters ?? {},
        page: lazyState.page,
        pageSize: lazyState.pageSize,
      });
    }
  }, [lazy, lazyState, onLazyLoad]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      const initialFilters: { [name: string]: DataTableFilterMetaData } = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };

      columns.forEach((col) => {
        if (col.field && col.filter) {
          initialFilters[col.field] = { value: null, matchMode: FilterMatchMode.CONTAINS };
        }
      });

      const resetState: ILazyState = {
        filters: initialFilters,
        sort: { field: '', order: null },
        page: 0,
        pageSize: quantity,
      };

      setlazyState(resetState);
      lazyLoadSubject.next({
        sortBy: '',
        sortOrder: 'asc',
        filters: initialFilters,
        page: 0,
        pageSize: quantity,
      });
    },
    reload: triggerLazyLoad,
  }));

  const onFilter = (event: any) => {
    setlazyState((prev) => ({
      ...prev,
      filters: event.filters,
    }));
  };

  const handlePageChange = (event: DataTableStateEvent) => {
    setlazyState((prev) => ({
      ...prev,
      page: event.page || 0,
      pageSize: event.rows || quantity,
    }));
  };

  const handleSortChange = (field: string, order: 1 | -1 | null) => {
    setlazyState((prev) => ({
      ...prev,
      sort: { field, order },
    }));
  };

  useEffect(() => {
    const initialFilters: { [name: string]: DataTableFilterMetaData } = {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };

    columns.forEach((col) => {
      if (col.field && col.filter) {
        initialFilters[col.field] = { value: null, matchMode: FilterMatchMode.CONTAINS };
      }
    });

    setlazyState((prev) => ({ ...prev, filters: initialFilters }));
  }, [columns]);

  useEffect(() => {
    if (lazy && onLazyLoad) {
      const subscription = lazyLoadSubject
        .pipe(
          debounceTime(500),
          distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
        )
        .subscribe((event) => {
          onLazyLoad(event);
        });

      lazyLoadSubject.next({
        sortBy: lazyState?.sort?.field ?? '',
        sortOrder: lazyState?.sort?.order === 1 ? 'asc' : 'desc',
        filters: lazyState?.filters ?? {},
        page: lazyState.page,
        pageSize: lazyState.pageSize,
      });

      return () => subscription.unsubscribe();
    }
  }, [lazy, lazyState]);

  const renderFilter = useCallback((options: ColumnFilterElementTemplateOptions, column: ITableColumns): ReactNode => {
    if (column.filter) {
      switch (column.filter.type) {
        default:
          return (
            <InputText
              type="text"
              className="p-inputtext-sm p-1"
              placeholder="search"
              value={options?.value ?? ''}
              onChange={(e) => options.filterApplyCallback(e.target?.value ?? '')}
              size="small"
            />
          );
      }
    }
    return null;
  }, []);

  const actionBodyTemplate = useCallback(
    (rowData: DataTableValue) => (
      <div className="d-flex align-items-center justify-content-center gap-3">
        {buttonsIcons?.map((key) => (
          <Button
            key={key}
            tooltip={ButtonsTranslate[key]}
            variant={ButtonVariant.ROUND}
            size="xs"
            showPopconfirm={key === (ButtonsKeys.DELETE as ITableIconsType)}
            handleClick={() => {
              startTransition(() => action({ rowData, type: key } as ITableButtonAction));
            }}
            aria-label={ButtonsTranslate[key]}
          >
            {icons[key.toLowerCase() as keyof typeof icons]}
          </Button>
        ))}
      </div>
    ),
    [action, buttonsIcons]
  );

  const customValue = useCallback(<T extends Record<string, T>>(value: T, column: ITableColumns): T | string | null => {
    return column.customizeValue ? column.customizeValue(value) : value;
  }, []);

  const bodyTemplate = useCallback(
    <T extends Record<string, T>>(rowData: DataTableValue, column: ITableColumns) => {
      const { field, type, userLogoSize } = column || {};
      if (type === 'Boolean') {
        return (
          <div className="d-flex justify-content-center">
            <i className={`pi ${rowData?.[field as string] ? 'pi-check-circle' : 'pi-times'}`}></i>
          </div>
        );
      }

      if (type === 'UserList') {
        return (
          <div className="d-flex justify-content-center gap-1">
            {customValue(rowData[field as string] ?? '', column)?.map((el: string, index: number) => (
              <LetteredAvatar key={index} name={el} size={userLogoSize} tooltipText={el} />
            ))}
          </div>
        );
      }

      if (field && rowData) {
        return <span>{customValue(rowData[field] ?? '', column)}</span>;
      }
      return null;
    },
    [customValue]
  );

  const classColumn = useCallback((type: ITableColumnsType): string => {
    return '';
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataTable
        dataKey="id"
        paginator={paginator}
        className="table-component"
        value={value}
        rows={lazyState?.pageSize ?? 5}
        totalRecords={totalRecords}
        rowsPerPageOptions={rowPerPageOptions}
        removableSort
        lazy={lazy}
        filterDisplay="row"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate={'Showing row from {first} to {last} of {totalRecords} items'}
        emptyMessage={t('No data found.')}
        onPage={handlePageChange}
        onSort={(e) => handleSortChange(e.sortField, e.sortOrder as 1 | -1)}
        onFilter={onFilter}
        size="small"
        first={(lazyState?.page ?? 0) * (lazyState?.pageSize ?? 5)}
        globalFilterFields={globalFilterFields}
        filters={lazyState.filters}
        sortField={lazyState?.sort?.field ?? ''}
        sortOrder={lazyState?.sort?.order ?? null}
        filterDelay={0}
        paginatorDropdownAppendTo="self"
      >
        {columns.map((col) => (
          <Column
            key={col?.header}
            sortable={col.sortable && !col.diableFiltrSort}
            field={col.field}
            header={() => t(col.header || '')}
            filter={allowFilters && !col.diableFiltrSort}
            filterElement={(options) => renderFilter(options, col)}
            showFilterMenu={false}
            showClearButton={false}
            body={(rowData: DataTableValue) => bodyTemplate(rowData, col)}
            bodyClassName={classColumn(col.type as ITableColumnsType)}
          />
        ))}

        {isColumnAction && (
          <Column
            key={'colAction'}
            header={t('Actions')}
            body={(rowData: DataTableValue) => actionBodyTemplate(rowData as DataTableValue)}
            exportable={false}
          />
        )}
      </DataTable>
    </Suspense>
  );
});

export default Table;
