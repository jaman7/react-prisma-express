import { Link } from 'react-router-dom';
import { IAuthPath } from './auth.enum';

const { PATH_LOGIN, PATH_SIGNUP, PATH_FORGOT_PASSWORD, PATH_UPDATE_PASSWORD } = IAuthPath;

const LoginFooter = ({ path, error }: { path?: string; error?: string }) => {
  const footerTextClassName = 'mb-3';
  const renderFooter = () => {
    switch (path) {
      case PATH_LOGIN:
        return (
          <>
            <p className={footerTextClassName}>
              Need an account? <Link to="/signup">Sign Up</Link>
            </p>
          </>
        );
      case PATH_SIGNUP:
        return (
          <>
            <p className={footerTextClassName}>
              Already have an account? <Link to="/login">Log In</Link>
            </p>
          </>
        );
      case PATH_UPDATE_PASSWORD:
        return (
          <>
            <p className={footerTextClassName}>
              <Link to="/">Cancel</Link>
            </p>
          </>
        );
      case PATH_FORGOT_PASSWORD:
        return (
          <>
            <p className={footerTextClassName}>
              Need an account? <Link to="/signup">Sign Up</Link>
            </p>
            <p className={footerTextClassName}>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <div className="d-block mt-5">
      {renderFooter()} {error && <p>{error}</p>}
    </div>
  );
};

export default LoginFooter;
