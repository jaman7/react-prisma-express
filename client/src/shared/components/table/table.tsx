import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Fragment } from 'react/jsx-runtime';
import Button from '../Button';
import { v4 as uuidv4 } from 'uuid';
import { icons } from './table.icons';
import { ITableColumns, ITableIconsType } from './table.model';

const Table = ({
  columns,
  value,
  buttonsIcons,
  action,
}: {
  action: (e?: any) => void;
  buttonsIcons?: ITableIconsType[];
  columns?: ITableColumns[];
  value?: any[];
}) => {
  const actionBodyTemplate = (rowData: any): JSX.Element | JSX.Element[] => {
    return (
      <Fragment>
        <div className="table-buttons-actions">
          {buttonsIcons?.map((icon: string) => {
            return icon ? (
              <Button key={uuidv4()} round={true} handleClick={() => action({ rowData, type: icon })}>
                {icons?.[icon?.toLowerCase()] ?? ''}
              </Button>
            ) : (
              <></>
            );
          })}
        </div>
      </Fragment>
    );
  };

  const bodyTemplate = (rowData, field: string) => <span>{rowData?.[field]}</span>;

  return (
    <DataTable className="table-component" value={value}>
      {columns?.map(col =>
        col.header === 'action' ? (
          <Column key={uuidv4()} body={actionBodyTemplate} exportable={false} />
        ) : (
          <Column key={uuidv4()} field={col.field} header={col.header} body={rowData => bodyTemplate(rowData, col?.field as string)} />
        )
      )}
    </DataTable>
  );
};
export default Table;
