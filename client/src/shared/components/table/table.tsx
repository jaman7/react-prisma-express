import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta, DataTableStateEvent } from 'primereact/datatable';
import Button from '../Button';
import { v4 as uuidv4 } from 'uuid';
import { icons } from './table.icons';
import { ITableColumns, ITableIconsType } from './table.model';
import { useState } from 'react';

interface TableProps {
  action: (e?: any) => void;
  buttonsIcons?: ITableIconsType[];
  columns?: ITableColumns[];
  value?: any[];
  paginator?: boolean;
  totalRecords?: number;
}

const Table = ({ columns, value, buttonsIcons, paginator = true, totalRecords, action }: TableProps) => {
  const actionBodyTemplate = (rowData: any): JSX.Element => (
    <div className="table-buttons-actions">
      {buttonsIcons?.map(key => (
        <Button key={uuidv4()} tooltip={`buttons.${key.toLowerCase()}`} round handleClick={() => action({ rowData, type: key })}>
          {icons?.[key?.toLowerCase()]}
        </Button>
      ))}
    </div>
  );

  const bodyTemplate = (rowData: any, field: string): JSX.Element => <span>{rowData[field]}</span>;

  return (
    <DataTable
      dataKey="id"
      paginator={paginator}
      className="table-component"
      value={value}
      totalRecords={totalRecords ?? 0}
      rows={5}
      rowsPerPageOptions={[5, 10, 25, 50]}
      removableSort
      paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
    >
      {columns?.map(col =>
        col.header === 'action' ? (
          <Column key={uuidv4()} header={col.header} body={actionBodyTemplate} exportable={false} />
        ) : (
          <Column
            key={uuidv4()}
            sortable
            field={col.field}
            header={col.header}
            body={rowData => bodyTemplate(rowData, col.field as string)}
          />
        )
      )}
    </DataTable>
  );
};
export default Table;
