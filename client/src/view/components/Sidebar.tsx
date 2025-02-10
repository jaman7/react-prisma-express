import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import { PiUsers } from 'react-icons/pi';
import { GoProjectSymlink } from 'react-icons/go';
import LazyImage from '@/shared/components/LazyImage';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store/store';
import { UsersTYpe } from '@/shared/enums';
import { useAuth } from '@/core/auth/userAuth';
import dataSlice from '@/store/dataSlice';
import Button, { ButtonVariant } from '@/shared/components/button/Button';
import CaretIcon from '@/shared/components/icons/CaretIcon';
import { ReactNode } from 'react';
import { Tooltip } from 'primereact/tooltip';
import { useTranslation } from 'react-i18next';

const { setIsSideBarOpen } = dataSlice.actions;

const Sidebar: React.FC = () => {
  const isSideBarOpen = useSelector((state: IRootState) => state?.dataSlice.isSideBarOpen);
  const dicts = useSelector((state: IRootState) => state?.dataSlice.dict);
  const { user = {}, setActiveBoard } = useAuth() || {};
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleRedirect = (path: string) => {
    navigate(path);
  };

  const handleSideBar = (): void => {
    dispatch(setIsSideBarOpen(!isSideBarOpen));
  };

  const handleBoard = async (id: string, isActive = true) => {
    console.log(id);
    if (!isActive) await setActiveBoard?.(id);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const menuData = [
    {
      name: 'Projects lists',
      icon: 'pi pi-folder',
      to: `/projects`,
    },
    {
      name: 'Users list',
      icon: 'pi pi-users',
      to: `/users-list`,
    },
  ];

  const renderSideMenu = (): ReactNode | ReactNode[] => {
    return dicts?.boardsByUserDict?.map((item, index) => (
      <li
        role="presentation"
        key={`boards-${index}`}
        className={classNames('item target-tooltip', { active: item.id === user?.activeBoardId, close: !isSideBarOpen })}
        onClick={() => handleBoard(item?.id as string, item.id === user?.activeBoardId)}
        data-pr-tooltip={t(item.displayName || '')}
        data-pr-classname="target-tooltip shadow-none"
        data-pr-position="right"
      >
        <i className="pi pi-tags"></i>
        <span className={classNames({ open: isSideBarOpen })}>{item?.displayName}</span>
      </li>
    ));
  };

  return (
    <motion.aside
      initial={{ width: isSideBarOpen ? 'auto' : 'auto' }}
      animate={{ width: isSideBarOpen ? 'auto' : 'auto' }}
      transition={{ duration: 0.5 }}
      className={`siedebar bg-secondary p-2`}
    >
      <div className={classNames('logo-container', { close: !isSideBarOpen })} onClick={() => handleRedirect('/')}>
        <LazyImage
          src="img/kanban.svg"
          alt="Logo"
          className="logo-img target-tooltip"
          data-pr-tooltip={t('Dashboard')}
          data-pr-classname="target-tooltip shadow-none"
          data-pr-position="right"
        />
        <h3 className={classNames('logo-text', { open: isSideBarOpen })}>Dashboard</h3>
      </div>

      <div className={classNames('board-list', { close: !isSideBarOpen })}>
        <h3 className={classNames('board-list-title', { open: isSideBarOpen })}>All boards ({dicts?.boardsByUserDict?.length})</h3>
        <ul className="board-list-menu">{renderSideMenu()}</ul>
      </div>

      {user?.role === UsersTYpe.ADMIN ? (
        <div className={classNames('manage-list', { close: !isSideBarOpen })}>
          <h5 className={classNames('manage-list-title', { open: isSideBarOpen })}>Manage</h5>

          <ul className={classNames('manage-list-menu', { open: isSideBarOpen })}>
            {menuData?.map((item, i) => (
              <li key={`menu-item-${i}`}>
                <NavLink
                  className={({ isActive, isPending }) =>
                    classNames('item target-tooltip', {
                      pending: isPending,
                      active: isActive,
                      close: !isSideBarOpen,
                    })
                  }
                  to={item.to as string}
                  data-pr-tooltip={t(item.name || '')}
                  data-pr-classname="target-tooltip shadow-none"
                  data-pr-position="right"
                >
                  <i className={item.icon}></i>
                  <span className={classNames({ open: isSideBarOpen })}>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Button variant={ButtonVariant.ROUND} size="xs" className="toggler" handleClick={handleSideBar} ariaLabel="Toggle Sidebar">
        <CaretIcon className={`icon ${isSideBarOpen ? 'open' : ''}`} />
      </Button>

      <Tooltip target=".target-tooltip" autoHide={true} />
    </motion.aside>
  );
};

export default Sidebar;
