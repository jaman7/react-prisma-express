import HttpService from '@/core/http/http.service';
import Button, { ButtonVariant } from '@/shared/components/button/Button';
import Table from '@/shared/components/table/table';
import { TableIcons } from '@/shared/components/table/table.enum';
import { ILazyState, ITableColumns, ITableIconsType } from '@/shared/components/table/table.model';
import { ButtonsKeys, ButtonsTranslate, MODAL_TYPE } from '@/shared/enums';
import { createTableColumnsConfig, setTableParams } from '@/shared/utils/table-utils';
import { IRootState } from '@/store/store';
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { IApiResponse, IProject, IUser } from './Projects.model';
import { apiProjects, columnConfig } from './Projects.config';
import { IModal } from '@/shared/model';
import { getProjects } from './Projects.service';

const { VIEW, EDIT, DELETE } = TableIcons;

const Projects: React.FC = () => {
  // const [modal, setModal] = useState<IModal>({});
  const [columns, setColumns] = useState<ITableColumns[]>([]);
  const [data, setData] = useState<IProject[]>([]);
  const [totalRecords, setRotalRecords] = useState(0);
  const [modal, setModal] = useState<IModal>({});

  const { t } = useTranslation();
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

  useEffect(() => {
    startTransition(() => {
      setColumns(
        createTableColumnsConfig(columnConfig, {
          prefix: 'table',
        })
      );
    });
  }, [columnConfig]);

  const getData = (event?: ILazyState) => {
    const params = setTableParams(event as ILazyState);

    console.log(params);

    getProjects(params)
      .then((res) => {
        const { data = [], pagination = {} } = res || {};

        const transformedData = data?.map((project) => ({
          ...project,
          users: project?.users?.map((user: IUser) => `${user?.name} ${user?.lastName}`) ?? [],
        }));

        setData(transformedData ?? []);
        setRotalRecords(pagination?.total ?? 0);
      })
      .catch((e) => {
        console.log('Failed to fetch suggestions.', e);
      });
  };

  return (
    <div className="d-block p-4 w-100">
      <h1>Projects</h1>
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

export default Projects;
