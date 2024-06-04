import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IModalType } from 'shared';
import LetteredAvatar from 'shared/components/LetteredAvatar';
import Table from 'shared/components/table/table';
import { ITableIconsType } from 'shared/components/table/table.model';
import { IRootState } from 'store/store';
import UserEditModal from 'view/components/modals/UserEditModal';

const UsersList = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any>({});
  const [data, setData] = useState<any>({});
  const [type, setType] = useState<IModalType | null>(null);
  const [columns, setColumns] = useState<any[]>([]);

  const users: any[] = useSelector((state: IRootState) => state?.dataSlice.users ?? []) ?? [];

  const logo = (user: any): JSX.Element => <LetteredAvatar name={`${user.name} ${user.lastName}`} />;

  const dataCol = [
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

  const action = (e: any): void => {
    setData(e.rowData);
    setType(e.type);
    setIsModalOpen(true);
  };

  const buttonsIcons: ITableIconsType[] = ['VIEW', 'EDIT', 'DELETE'];

  useEffect(() => {
    setTableData(users.map(el => ({ ...el, avatar: logo(el) })));
    setColumns(dataCol);
  }, []);

  return (
    <div className="p-4">
      <h1>Users</h1>
      <Table columns={columns ?? []} value={tableData} action={action} buttonsIcons={buttonsIcons} />

      {isModalOpen ? <UserEditModal type={type as IModalType} id={data.id} setVisible={setIsModalOpen} visible={isModalOpen} /> : <></>}
    </div>
  );
};

export default UsersList;
