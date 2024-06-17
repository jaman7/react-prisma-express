import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IBoard } from 'store/data.model';
import { IRootState } from 'store/store';
import Button from 'shared/components/Button';
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import { MODAL_TYPE, UsersTYpe } from 'shared';
import { v4 as uuidv4 } from 'uuid';
import LazyImage from 'shared/components/LazyImage';
import { NavLink, useNavigate } from 'react-router-dom';
import cx from 'classnames';
import dataSlice from 'store/dataSlice';
import { PiUsers } from 'react-icons/pi';
import { GoProjectSymlink } from 'react-icons/go';
import { useAuth } from 'core/auth/userAuth';

const { setIsSideBarOpen } = dataSlice.actions;
const { ADD } = MODAL_TYPE;

const Sidebar = () => {
  const [isOpen, setOpen] = useState(false);
  // const [isBoardModalOpen, setIsBoardModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const boards: IBoard[] = useSelector((state: IRootState) => state?.dataSlice?.boards ?? []);
  const isAdmin: boolean = useSelector((state: IRootState) => state?.dataSlice?.user?.role === 'ADMIN') as boolean;
  const isSideBarOpen = useSelector((state: IRootState) => state?.dataSlice.isSideBarOpen);
  const navigate = useNavigate();
  const { user = {} } = useAuth() || {};

  const handleRedirect = (path: string) => {
    navigate(path);
  };

  const handleSideBar = () => {
    dispatch(setIsSideBarOpen(!isSideBarOpen));
  };

  const menuData = [
    {
      name: 'Manage',
      isHeading: true,
    },
    {
      name: 'Projects lists',
      icon: <GoProjectSymlink />,
      to: `/projects`,
    },
    {
      name: 'Users list',
      icon: <PiUsers />,
      to: `/users-list`,
    },
  ];

  // const renderSideMenu = (): JSX.Element | JSX.Element[] | undefined => {
  //   return boards?.map((item, index) => (
  //     <li
  //       role="presentation"
  //       key={uuidv4()}
  //       className={`item ${item.isActive ? 'active' : ''}`}
  //       onClick={() => {
  //         dispatch(boardsSlice?.actions?.setBoardActive?.({ index }));
  //       }}
  //     >
  //       <BoardIcon /> <span className="">{item?.name}</span>
  //     </li>
  //   ));
  // };

  // UsersTYpe

  return (
    <>
      <div className={cx('sidebar', { open: isSideBarOpen, close: !isSideBarOpen })}>
        <div className="sidebar__logo" onClick={() => handleRedirect('/')}>
          <LazyImage src="img/kanban.svg" alt="Logo" className="lazyload sidebar__logo--img" />
          <h3 className={cx('sidebar__logo--title', { open: isSideBarOpen })}>Dashboard</h3>
        </div>

        {/* <h3 className="sidebar-title m-0 py-3">ALL BOARDS ({boards?.length})</h3>
        <ul className="sidebar-menu">
          {renderSideMenu()}

          <li key={uuidv4()} role="presentation" className="item" onClick={() => setIsBoardModalOpen?.(true)}>
            <BoardIcon />
            <span className="">Create New Board</span>
          </li>
        </ul> */}

        {user?.role === UsersTYpe.ADMIN ? (
          <ul className="sidebar-menu">
            {menuData?.map(item => (
              <li key={uuidv4()} className={cx('item', { 'item-head': item.isHeading })}>
                {item.isHeading ? (
                  <h5 className={cx('heading', { open: isSideBarOpen })}>Manage</h5>
                ) : (
                  <NavLink
                    className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : '')}
                    to={item.to as string}
                  >
                    <i>{item.icon ?? <></>}</i> <span className={cx('title', { open: isSideBarOpen })}>{item.name}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <></>
        )}

        <Button handleClick={() => handleSideBar()}>
          {isSideBarOpen ? <MdKeyboardDoubleArrowLeft /> : <MdKeyboardDoubleArrowRight />}
          {isSideBarOpen && <span className="ms-1 line-height">Hide Sidebar</span>}
        </Button>
      </div>
      {/* {isBoardModalOpen && <AddEditBoardModal type={ADD} isBoardModalOpen={isBoardModalOpen} setIsBoardModalOpen={setIsBoardModalOpen} />} */}
    </>
  );
};

export default Sidebar;
