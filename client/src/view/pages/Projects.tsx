import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LazyImage from 'shared/components/LazyImage';
import Table from 'shared/components/table/table';
import { TableIcons } from 'shared/components/table/table.enum';
import { ITableIconsType } from 'shared/components/table/table.model';
import { fetchBoards } from 'store/actions/bordsActions';
import { IBoard } from 'store/data.model';
import { IRootState } from 'store/store';
import BoardEditModal from 'view/components/modals/BoardEditModal';
import { IModal } from 'view/components/modals/modal.model';

const { VIEW, EDIT, DELETE } = TableIcons;

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modal, setModal] = useState<IModal>({});

  const boards: IBoard[] = useSelector((state: IRootState) => state?.dataSlice?.boards ?? []) ?? [];

  const dispatch = useDispatch();

  const columns = [
    { field: 'name', header: 'Project' },
    { field: 'team', header: 'Team' },
    { field: 'statusId', header: 'Status' },
    { header: 'action' },
  ];

  const buttonsIcons: ITableIconsType[] = [VIEW, EDIT, DELETE];

  const action = (event: any): void => {
    const { rowData, type } = event || {};
    setModal({ id: rowData.id, type });
    setIsModalOpen(true);
  };

  useEffect(() => {
    dispatch(fetchBoards());
  }, []);

  return (
    <div className="p-4">
      <h1>Users</h1>
      <Table columns={columns ?? []} totalRecords={boards?.length ?? 0} value={boards ?? []} action={action} buttonsIcons={buttonsIcons} />

      {isModalOpen ? <BoardEditModal modal={modal} setVisible={setIsModalOpen} visible={isModalOpen} /> : <></>}
    </div>
  );
};

export default Projects;
