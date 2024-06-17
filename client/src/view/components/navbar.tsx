import Hamburger from 'hamburger-react';
import { Fragment, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useClickAway, useWindowSize } from 'react-use';
import { IRootState } from 'store/store';
import { Variants, motion } from 'framer-motion';
import cx from 'classnames';
import dataSlice from 'store/dataSlice';
import LetteredAvatar from 'shared/components/LetteredAvatar';
import { useAuth } from 'core/auth/userAuth';

const { setIsSideBarOpen } = dataSlice.actions;

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);
  const ref = useRef(null);
  const size = useWindowSize();
  const { user = {} } = useAuth() || {};
  const isSideBarOpen = useSelector((state: IRootState) => state?.dataSlice.isSideBarOpen);
  const dispatch = useDispatch();
  const { name, lastName, role, email } = user || {};

  useClickAway(ref, () => {
    setIsActive(false);
  });

  const setOpenSideBar = () => {
    dispatch(setIsSideBarOpen(!isSideBarOpen));
  };

  const isMobile = size.width < 768;

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
    open: { height: 'auto', opacity: 1, display: 'flex', transition: { duration: 0.3 }, visibility: 'visible' },
    closed: { height: 0, opacity: 0, display: 'none', transition: { duration: 0.3 }, visibility: 'hidden' },
  };

  const logo = (): JSX.Element => <LetteredAvatar name={`${user?.name} ${user?.lastName}`} />;

  const userInfo = (isMenu: boolean): JSX.Element => {
    return (
      <div className={cx('flex-v-center', { 'bg-light-blue': !isMenu, 'p-0': !isMenu })}>
        {logo()}
        <div className="d-flex-column ml-2  is-flex-grow-1 is-align-content-space-between">
          {isMenu ? <div className="user-role">{role}</div> : <></>}
          <span className={cx('user-name', { 'user-name-info mt-1': !isMenu })}>
            {name} {lastName}
          </span>
          {isMenu ? <></> : <span className="font-12 mt-1">{email}</span>}
        </div>
      </div>
    );
  };

  return (
    <nav ref={ref} className="nav">
      {isMobile ? <Hamburger toggled={isSideBarOpen} size={20} toggle={setOpenSideBar} /> : <></>}

      <ul className="menu">
        <li className="dropdown">
          <NavLink key={'item.name'} className="dropdown-toggle" to="#" onClick={() => setIsActive?.(!isActive)}>
            {userInfo(true)}
          </NavLink>

          <motion.div animate={isActive ? 'open' : 'closed'} variants={variants} className={cx('dropdown-menu', { open: isActive })}>
            <div className="d-flex-column bg-light-blue p-4">{userInfo(false)}</div>

            <div className="d-flex-column">
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
