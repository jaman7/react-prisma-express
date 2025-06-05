import Hamburger from 'hamburger-react';
import { Fragment, ReactNode, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useClickAway, useWindowSize } from 'react-use';
import { Variants, motion } from 'framer-motion';
import classNames from 'classnames';
import { useAuth } from '@/core/auth/userAuth';
import LetteredAvatar from '@/shared/components/LetteredAvatar';
import { useGlobalStore } from '@/store/useGlobalStore';

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);
  const ref = useRef(null);
  const size = useWindowSize();
  const { user = {} } = useAuth() || {};
  const isSideBarOpen = useGlobalStore((state) => state.isSideBarOpen ?? {});
  const { name, lastName, role, email } = user || {};

  const { setIsSideBarOpen } = useGlobalStore();

  useClickAway(ref, () => {
    setIsActive(false);
  });

  const setOpenSideBar = () => {
    setIsSideBarOpen();
  };

  const isMobile = size.width < 640;

  const menuDropdownData = [
    {
      name: 'View profile',
      to: `/user-profile`,
    },
    {
      name: 'Logout',
      to: `/logout`,
    },
  ];

  const variants: Variants = {
    open: { height: 'auto', opacity: 1, display: 'flex', transition: { duration: 0.5 }, visibility: 'visible' },
    closed: { height: 0, opacity: 0, display: 'none', transition: { duration: 0.5 }, visibility: 'hidden' as 'hidden' },
  };

  const logo = (): ReactNode => <LetteredAvatar name={`${user?.name} ${user?.lastName}`} />;

  const userInfo = (isMenu: boolean): ReactNode => {
    return (
      <div className={classNames('d-flex align-items-center p-0', { 'bg-secondary': !isMenu })}>
        {logo()}
        <div className="d-flex flex-column ms-2 justify-content-between">
          {isMenu ? <div className="user-role">{role}</div> : <></>}
          <span className={classNames('user-name', { 'user-name-info mt-1': !isMenu })}>
            {name} {lastName}
          </span>
          {isMenu ? <></> : <span className="font-12 mt-1">{email}</span>}
        </div>
      </div>
    );
  };

  return (
    <nav ref={ref} className="user-nav">
      {isMobile ? <Hamburger toggled={isSideBarOpen} size={20} toggle={setOpenSideBar} /> : <></>}

      <ul className="menu">
        <li className="dropdown">
          <NavLink key={'item.name'} className="dropdown-toggle" to="#" onClick={() => setIsActive?.(!isActive)}>
            {userInfo(true)}
          </NavLink>

          <motion.div
            animate={isActive ? 'open' : 'closed'}
            variants={variants}
            className={classNames('dropdown-menu', {
              open: isActive,
            })}
          >
            <div className="d-flex flex-column bg-secondary p-2">{userInfo(false)}</div>

            <div className="d-flex flex-column">
              {menuDropdownData?.map((item, i) => (
                <Fragment key={`menu-item-${i}`}>
                  {i === menuDropdownData.length - 1 ? <hr className="dropdown-divider" /> : <></>}
                  <NavLink to={item.to} className="link-item">
                    {item.name}
                  </NavLink>
                </Fragment>
              ))}
            </div>
          </motion.div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
