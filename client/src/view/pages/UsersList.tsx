import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LetteredAvatar from 'shared/components/LetteredAvatar';
import Table from 'shared/components/table/table';
import { TableIcons } from 'shared/components/table/table.enum';
import { ITableIconsType } from 'shared/components/table/table.model';
import { fetchUsers } from 'store/actions/usersActions';
import { IUser } from 'store/data.model';
import { IRootState } from 'store/store';
import UserEditModal from 'view/components/modals/UserEditModal';
import { IModal } from 'view/components/modals/modal.model';

const { VIEW, EDIT, DELETE } = TableIcons;

const UsersList = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modal, setModal] = useState<IModal>({});

  const dispatch = useDispatch();

  const users: IUser[] = useSelector((state: IRootState) => state?.dataSlice.users ?? []);

  // const logo = (user: any): JSX.Element => <LetteredAvatar name={`${user.name} ${user.lastName}`} />;

  const columns = [
    { field: 'avatar', header: 'avatar' },
    { field: 'name', header: 'Name' },
    { field: 'lastName', header: 'Last name' },
    { field: 'title', header: 'Title' },
    { field: 'email', header: 'Email' },
    { field: 'phone', header: 'phone' },
    { field: 'location', header: 'location' },
    { field: 'role', header: 'role' },
    { field: 'boards', header: 'boards' },
    { header: 'action' },
  ];

  const action = (event: any): void => {
    const { rowData, type } = event || {};
    setModal({ id: rowData.id, type });
    setIsModalOpen(true);
  };

  const buttonsIcons: ITableIconsType[] = [VIEW, EDIT, DELETE];

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  return (
    <div className="p-4">
      <h1>Users</h1>
      <Table columns={columns ?? []} totalRecords={users?.length ?? 0} value={users ?? []} action={action} buttonsIcons={buttonsIcons} />

      {isModalOpen ? <UserEditModal modal={modal} setVisible={setIsModalOpen} visible={isModalOpen} /> : <></>}
    </div>
  );
};

export default UsersList;
