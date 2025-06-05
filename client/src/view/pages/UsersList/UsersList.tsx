import Button, { ButtonVariant } from '@/shared/components/button/Button';
import Table from '@/shared/components/table/table';
import { TableIcons } from '@/shared/components/table/table.enum';
import { ILazyState, ITableColumns, ITableIconsType } from '@/shared/components/table/table.model';
import { ButtonsKeys, ButtonsTranslate, MODAL_TYPE } from '@/shared/enums';
import { IModal } from '@/shared/model';
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import { IUsers } from './UsersList.model';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';
import { createTableColumnsConfig, setTableParams } from '@/shared/utils/table-utils';
import { getUsers } from './UsersList.service';
import { columnConfig } from './UsersList.config';
import { catchError, of, tap } from 'rxjs';
import { useGlobalStore } from '@/store/useGlobalStore';

const { VIEW, EDIT, DELETE } = TableIcons;

const UsersList: React.FC = () => {
  const [columns, setColumns] = useState<ITableColumns[]>([]);
  const [data, setData] = useState<IUsers[]>([]);
  const [totalRecords, setRotalRecords] = useState(0);
  const [modal, setModal] = useState<IModal>({});

  const { setIsLoading } = useGlobalStore();

  const { t } = useFallbackTranslation();

  const buttonsIcons: ITableIconsType[] = useMemo(() => [VIEW, EDIT, DELETE], []);

  const onDelete = useCallback((id: string): void => {
    // Implement delete logic here
  }, []);

  const action = useCallback(
    (event?: any): void => {
      const { rowData, type } = event || {};

      if (type === ButtonsKeys.DELETE) {
        onDelete(rowData.id);
      } else {
        startTransition(() => {
          setModal({ id: rowData?.id ?? null, type: type ?? MODAL_TYPE.ADD });
          // setIsModalOpen(true);
        });
      }
    },
    [onDelete]
  );

  const getData = (event?: ILazyState) => {
    setIsLoading(true);
    const params = setTableParams(event as ILazyState);
    const subscription = getUsers(params)
      .pipe(
        tap((res) => {
          const { data = [], pagination = {} } = res || {};
          setData(data ?? []);
          setRotalRecords(pagination?.total ?? 0);
          setIsLoading(false);
        }),
        catchError((error) => {
          setIsLoading(false);
          console.error('Failed to fetch suggestions.', error);
          return of({});
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  };

  useEffect(() => {
    startTransition(() => {
      setColumns(
        createTableColumnsConfig(columnConfig, {
          prefix: 'table',
        })
      );
    });
  }, [columnConfig]);

  return (
    <div className="d-flex flex-column gap-3 w-100">
      <h2 className="title">users lists</h2>
      <div className="d-block">
        <Button
          handleClick={() => {
            startTransition(() => {
              action();
            });
          }}
          variant={ButtonVariant.PRIMARY}
          size="sm"
        >
          {t(ButtonsTranslate.ADD)}
        </Button>
      </div>
      <Table
        columns={columns ?? []}
        totalRecords={totalRecords}
        value={data}
        action={action}
        buttonsIcons={buttonsIcons}
        isColumnAction={true}
        lazy={true}
        allowFilters={true}
        quantity={10}
        range={[5, 50, 5]}
        onLazyLoad={getData}
      />

      {/* {isModalOpen ? <ProjectsEditModal modal={modal} setVisible={setIsModalOpen} visible={isModalOpen} /> : <></>} */}
    </div>
  );
};

export default UsersList;
