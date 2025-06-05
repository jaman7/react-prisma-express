import { useAuth } from '@/core/auth/userAuth';
import Navbar from './UsernNav';
import { DATE_TIME_FORMAT } from '@/shared/enums';
import { format } from 'date-fns';
import Notifications from './Notifications';

const Header = () => {
  const { user = {} } = useAuth() || {};

  return (
    <header className="header">
      <div className="header-container">
        <Notifications />
        <span className="text-blue-400 text-xs me-3">
          Syns on:
          {user?.dateSync ? format(new Date(user?.dateSync?.toLocaleString() as string), DATE_TIME_FORMAT.FNS_DATE_TIME_NO_SEC) : null}
        </span>

        {/* <LanguageSwitcher /> */}
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
