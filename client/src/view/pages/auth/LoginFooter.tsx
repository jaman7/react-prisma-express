import { Link } from 'react-router-dom';
import { IAuthPath } from './auth.enum';

const { PATH_LOGIN, PATH_SIGNUP, PATH_FORGOT_PASSWORD, PATH_UPDATE_PROFILE } = IAuthPath;

const LoginFooter = ({ path, error }: { path?: string; error?: string }) => {
  const footerTextClassName = 'login-footer-text';
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
      case PATH_UPDATE_PROFILE:
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
    <div className="w-100 text-center mt-2">
      {renderFooter()} {error && <p>{error}</p>}
    </div>
  );
};

export default LoginFooter;
