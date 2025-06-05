import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import LazyImage from '@/shared/components/LazyImage';
import { UsersTYpe } from '@/shared/enums';
import { useAuth } from '@/core/auth/userAuth';
import Button, { ButtonVariant } from '@/shared/components/button/Button';
import CaretIcon from '@/shared/components/icons/CaretIcon';
import { ReactNode } from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';
import { toSeoUrlCase } from '@/shared/utils/helpers';

const Sidebar: React.FC = () => {
  const isSideBarOpen = useGlobalStore((state) => state.isSideBarOpen ?? {});
  const dicts = useGlobalStore((state) => state.dictionary ?? {});

  const { setIsSideBarOpen } = useGlobalStore();
  const { user = {}, setActivProject } = useAuth() || {};

  const { t } = useFallbackTranslation();
  const navigate = useNavigate();

  const handleRedirect = (path: string) => {
    navigate(path);
  };

  const handleSideBar = (): void => {
    setIsSideBarOpen();
  };

  const handleBoard = (id: string, isActive = true) => {
    if (!isActive) {
      setActivProject?.(id);
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
    return dicts?.userProjectsDict?.map((item, index) => (
      <li
        role="presentation"
        key={`project-${index}`}
        onClick={() => handleBoard(item?.id as string, item.id === user?.activeProjectId)}
        data-pr-tooltip={t(item.displayName || '')}
        data-pr-classname="target-tooltip shadow-none"
        data-pr-position="right"
      >
        <NavLink
          className={({ isActive, isPending }) =>
            classNames('item target-tooltip', {
              pending: isPending,
              last: item.id === user?.activeProjectId,
              active: isActive,
              close: !isSideBarOpen,
            })
          }
          to={`/project/${toSeoUrlCase(item?.displayName as string)}/${item.id}`}
          data-pr-tooltip={t(item.displayName || '')}
          data-pr-classname="target-tooltip shadow-none"
          data-pr-position="right"
        >
          <i className="pi pi-tags"></i>
          <span className={classNames({ open: isSideBarOpen })}>{item?.displayName}</span>
        </NavLink>
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

      <div className={classNames('project-list', { close: !isSideBarOpen })}>
        <h3 className={classNames('project-list-title', { open: isSideBarOpen })}>All boards ({dicts?.boardsByUserDict?.length})</h3>
        <ul className="project-list-menu">{renderSideMenu()}</ul>
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
    </motion.aside>
  );
};

export default Sidebar;
