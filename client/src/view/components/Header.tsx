import { v4 as uuidv4 } from 'uuid';
import { DATE_TIME_FORMAT } from 'shared';
import { useAuth } from 'core/auth/userAuth';
import { dateFormat, dateIsoLocal } from 'shared/utils/helpers';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';

interface IMenu {
  children?: string | JSX.Element;
  subMenu?: IMenu[];
  action?: () => void;
}

const Header = () => {
  const nawigate = useNavigate();
  const { user = {} } = useAuth() || {};

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

  const handleRedirect = (path: string) => {
    nawigate(path);
  };

  return (
    <header className="header bg-white">
      <div className="header-menu">
        <div className="sync">
          <span>Syns on: {dateFormat(dateIsoLocal(user?.dateSync as string) as string, DATE_TIME_FORMAT.MOMENT_DATE_TIME)}</span>
        </div>
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
