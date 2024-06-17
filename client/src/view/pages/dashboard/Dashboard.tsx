import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchUsers } from 'store/actions';
import boardsSlice from 'store/dataSlice';
import { IBoard, IUser } from 'store/data.model';
import { IRootState } from 'store/store';
import Content from 'view/pages/dashboard/Content';
// import Sidebar from 'view/components/Sidebar';
// import Header from 'view/components/Header';
// import { fetchBoards } from 'store/actions/bordsActions';
// import { useAuth } from 'core/auth/userAuth';
// import dataSlice from 'store/dataSlice';
// const { setUser } = dataSlice.actions;

const Dashboard = () => {
  // const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);

  const dispatch = useDispatch();
  // const { currentUser } = useAuth() || {};
  const boards: IBoard[] = useSelector((state: IRootState) => state?.dataSlice?.boards ?? []) ?? [];
  // const users: IUser[] = useSelector((state: IRootState) => state?.dataSlice.users ?? []);

  // useEffect(() => {
  //   dispatch(fetchUsers());
  //   dispatch(fetchBoards());
  // }, []);

  // useEffect(() => {
  //   dispatch(setUser(currentUser?.email));
  // }, [users]);

  useEffect(() => {
    const activeBoard = boards.find(board => board.isActive);
    if (!activeBoard && boards.length > 0) dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
  }, [boards]);

  return <Content />;
};

export default Dashboard;
