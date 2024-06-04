import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LazyImage from 'shared/components/LazyImage';
import Table from 'shared/components/table/table';
import { IBoard } from 'store/data.model';
import { IRootState } from 'store/store';

const Projects = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);

  const boards: IBoard[] = useSelector((state: IRootState) => state?.dataSlice?.boards ?? []) ?? [];

  const users = (users: any[]) => {
    return (
      <ul className="table-users-field">
        {users.map((el, i) => (
          <li key={i}>
            <LazyImage src={el.image} alt={el.name} className="lazyload" />
          </li>
        ))}
      </ul>
    );
  };

  useEffect(() => {
    const data = boards?.map(({ name, id }) => ({ name, id }));
    const dataCol = [{ field: 'name', header: 'Project' }, { field: 'team', header: 'Team' }, , { field: 'statusId', header: 'Status' }];
    setData(data);
    setColumns(dataCol);

    console.log(boards);
  }, [boards]);

  return (
    <div className="p-4">
      <h1>Projects</h1>
      <Table columns={columns} value={data} />
    </div>
  );
};

export default Projects;
