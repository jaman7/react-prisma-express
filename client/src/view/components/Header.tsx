import { SetStateAction, useState, Dispatch as ReactDispatch, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import LazyImage from '../../shared/components/LazyImage';
import DotsIcon from 'shared/components/DotsIcon';
import { IRootState } from 'store/store';
import { IBoard, IUser } from 'store/data.model';
import { DATE_TIME_FORMAT, MODAL_TYPE } from 'shared';
import { deleteBoardAction } from 'store/actions/bordsActions';
import { useAuth } from 'core/auth/userAuth';
import { dateFormat } from 'shared/utils/helpers';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';

export interface IProps {
  setIsBoardModalOpen?: ReactDispatch<SetStateAction<boolean>>;
  setIsTaskModalOpen?: ReactDispatch<SetStateAction<boolean>>;
  isBoardModalOpen?: boolean;
  isTaskModalOpen?: boolean;
  setModalType?: ReactDispatch<SetStateAction<string>>;
}

interface IMenu {
  children?: string | JSX.Element;
  subMenu?: IMenu[];
  action?: () => void;
}

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState<boolean>(false);
  const [boardType, setBoardType] = useState('add');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const nawigate = useNavigate();
  const user: IUser = useSelector((state: IRootState) => state?.dataSlice.user ?? {});

  const dropdownRef = useRef(null);

  const dispatchAction = useDispatch();
  const { currentUser } = useAuth() || {};

  const boards: IBoard[] = useSelector((state: IRootState) => state.dataSlice.boards) ?? [];
  const board: IBoard = boards?.find(board => board.isActive) ?? {};

  const menu = (): IMenu[] => {
    return [
      {
        children: '+ Add New Task',
        action: () => {
          // setModalType?.(ADD);
          // setIsTaskModalOpen?.(prevState => !prevState);
        },
      },
      {
        children: '+ New Column',
        action: () => {
          // setIsTaskModalOpen?.(prevState => !prevState);
        },
      },
      {
        children: <DotsIcon />,
        action: () => handleMenuOption(),
        subMenu: [
          {
            children: 'Edit Board',
            action: () => setIsModalOpen?.(true),
          },
          {
            children: 'Delete Board',
            action: () => setIsDeleteModalOpen?.(true),
          },
        ],
      },
    ];
  };

  const onDropdownClick = (): void => {
    setIsElipsisMenuOpen?.(false);
    setBoardType?.('add');
  };

  const onDeleteBtnClick = (e): void => {
    if (e.target.textContent === 'Delete') {
      dispatchAction(deleteBoardAction(board?.id as number, dispatchAction));
      setIsDeleteModalOpen?.(false);
    } else {
      setIsDeleteModalOpen?.(false);
    }
  };

  const handleMenuOption = (): void => {
    setBoardType?.('edit');
    setIsElipsisMenuOpen?.(prevState => !prevState);
  };

  const menuDropdownData = [
    {
      name: 'User profile',
      to: `/user-profile`,
    },
    {
      name: 'Logout',
      to: `/login`,
    },
  ];

  const handleToggle = () => {
    setNavbarOpen(!navbarOpen);
  };

  const closeMenu = () => {
    setNavbarOpen(false);
  };

  const handleToggleDropdown = () => setIsActive(!isActive);
  const closeDropdown = () => setIsActive(false);

  const recursiveMenu = (data: IMenu[], isDropdownItems?: boolean): JSX.Element | JSX.Element[] | undefined => {
    return data?.map((items, i) => {
      if (!items?.subMenu) {
        return (
          <li className={`${isDropdownItems ? `dropdown_item-${i + 1}` : 'item'}`} key={uuidv4()} onClick={() => items?.action?.()}>
            {items.children}
          </li>
        );
      }
      return (
        <li className="item dropdown" key={uuidv4()}>
          {items.children}
          <ul className="dropdown_menu dropdown_menu--animated">{recursiveMenu(items.subMenu, true)}</ul>
        </li>
      );
    });
  };

  const iconDropDopwn = () => (openDropdown ? 'img/icon-chevron-up.svg' : 'img/icon-chevron-down.svg');

  const handleRedirect = (path: string) => {
    nawigate(path);
  };

  return (
    <header className="header bg-white">
      <div className="header__logo" onClick={() => handleRedirect('/')}>
        gxfg
        {/* <LazyImage src="img/kanban.svg" alt="Logo" className="img-fluid lazyload header__logo--img" /> */}
        <h3 className="title ms-2">Dashboard</h3>
        {/* <div className="flex-v-center">
          <h3 className="title m-0">{board.name}</h3>
          <LazyImage src={iconDropDopwn()} alt=" dropdown icon" className="img-fluid lazyload" onClick={onDropdownClick} />
        </div> */}
      </div>

      <div className="header-menu">
        <div className="sync">
          <span>Syns on: {dateFormat(user?.dateSync as string, DATE_TIME_FORMAT.MOMENT_DATE_TIME)}</span>
        </div>
        <Navbar />
      </div>

      {/* <nav className="header-menu">
        <ul className="menu">{recursiveMenu(menu())}</ul>
      </nav>

      {isModalOpen ? <AddEditBoardModal type={EDIT} isBoardModalOpen={isModalOpen} setIsBoardModalOpen={setIsModalOpen} /> : <></>}

      {isDeleteModalOpen ? (
        <DeleteModal
          isTask={false}
          title={''}
          onDeleteBtnClick={onDeleteBtnClick}
          setIsModalOpen={setIsDeleteModalOpen}
          isModalOpen={isDeleteModalOpen}
        />
      ) : (
        <></>
      )} */}
    </header>
  );
};

export default Header;
