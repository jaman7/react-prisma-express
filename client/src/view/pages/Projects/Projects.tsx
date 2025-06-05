import Button, { ButtonVariant } from '@/shared/components/button/Button';
import Table, { TableRef } from '@/shared/components/table/table';
import { TableIcons } from '@/shared/components/table/table.enum';
import { ILazyState, ITableButtonAction, ITableColumns, ITableIconsType } from '@/shared/components/table/table.model';
import { ButtonsKeys, ButtonsTranslate, MODAL_TYPE } from '@/shared/enums';
import { createTableColumnsConfig, setTableParams } from '@/shared/utils/table-utils';
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IProject, IUser } from './Projects.model';
import { columnConfig } from './Projects.config';
import { IModal, IModalButtonsType, IModalType } from '@/shared/model';
import { deleteProject, getProjects } from './Projects.service';
import { catchError, of, tap } from 'rxjs';
import { useGlobalStore } from '@/store/useGlobalStore';
import ProjectsEditModal from './ProjectsEditModal/ProjectsEditModal';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';
import ProjectsAssignModal from './ProjectsAssignModal/ProjectsAssignModal';
import { IParams } from '@/core/http/http.models';
import { showToast } from '@/shared/utils/showToast';
import { useLocation, useNavigate } from 'react-router-dom';

const { VIEW, EDIT, DELETE, ASSIGN } = TableIcons;

const Projects: React.FC = () => {
  const [columns, setColumns] = useState<ITableColumns[]>([]);
  const [data, setData] = useState<IProject[]>([]);
  const [totalRecords, setRotalRecords] = useState(0);
  const [allModalAll, setModalAll] = useState<IModal>({});
  const [assignModal, setAssignModal] = useState<IModal>({});
  const [params, setParams] = useState<IParams>({});
  const tableRef = useRef<TableRef>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useFallbackTranslation();
  const isArchiveMode = location.pathname.includes('/archive');
  const buttonsIcons: ITableIconsType[] = useMemo(() => (isArchiveMode ? [VIEW] : [VIEW, EDIT, ASSIGN, DELETE]), [isArchiveMode]);

  const handleArchive = (): void => {
    navigate(isArchiveMode ? '/projects' : '/projects/archive');
  };

  const action = useCallback((event?: ITableButtonAction): void => {
    const { rowData, type } = event ?? {};

    if (type === ButtonsKeys.DELETE) {
      deleteOrArchive(rowData?.id);
    } else if (type === ButtonsKeys.ASSIGN) {
      setAssignModal({ id: rowData?.id ?? null, type: (type as IModalType) ?? (MODAL_TYPE.ADD as IModalType), visible: true });
    } else {
      startTransition(() => {
        setModalAll({ id: rowData?.id ?? null, type: (type as IModalType) ?? (MODAL_TYPE.ADD as IModalType), visible: true });
      });
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      tableRef.current?.reset();
    }, 0);

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  useEffect(() => {
    setColumns(createTableColumnsConfig(columnConfig, { prefix: 'table' }));
  }, []);

  const getData = useCallback(
    (event?: ILazyState) => {
      const baseParams = setTableParams(event as ILazyState);
      if (!baseParams?.pageSize) return;
      const fullParams = {
        ...baseParams,
        isArchive: isArchiveMode,
      };
      setParams(fullParams);
      const subscription = getProjects(fullParams)
        .pipe(
          tap((res) => {
            const { data = [], pagination = {} } = res || {};
            const transformedData = data?.map((project) => ({
              ...project,
              users: project?.users?.map((user: IUser) => `${user?.name} ${user?.lastName}`) ?? [],
            }));

            setData(transformedData ?? []);
            setRotalRecords(pagination?.total ?? 0);
          }),
          catchError((error) => {
            console.error('Failed to fetch Projects.', error);
            return of({});
          })
        )
        .subscribe();
      return () => subscription.unsubscribe();
    },
    [isArchiveMode, params]
  );

  const deleteOrArchive = (id: string) => {
    const subscription = deleteProject(id)
      .pipe(
        tap((res) => {
          const { status, message } = res || {};
          showToast('success', status, message);
          getData(params);
        }),
        catchError((error) => {
          console.error('Failed to fetch Projects.', error);
          return of({});
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  };

  return (
    <div className="d-flex flex-column gap-3 w-100">
      <h2 className="title">{t('title')}</h2>
      <div className="d-flex gap-2">
        <Button
          handleClick={() => {
            action({ type: ButtonsKeys.ADD as IModalButtonsType });
          }}
          variant={ButtonVariant.PRIMARY}
          size="sm"
        >
          {t(ButtonsTranslate.ADD)}
        </Button>

        <Button handleClick={handleArchive} variant={ButtonVariant.PRIMARY} size="sm">
          {isArchiveMode ? 'Switch to active' : 'Switch to archived'}
        </Button>
      </div>

      <Table
        ref={tableRef}
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

      {allModalAll?.visible && <ProjectsEditModal modal={allModalAll} setModal={setModalAll} />}
      {assignModal?.visible && <ProjectsAssignModal modal={assignModal} setModal={setAssignModal} />}
    </div>
  );
};

export default Projects;
