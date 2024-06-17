import { useAuth } from 'core/auth/userAuth';
import { FormikProps, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IFormElements } from 'shared/components/formElements/FormElements.model';
import { createConfigForm } from 'shared/utils/helpers';
import { IAuthPath } from './auth.enum';
import { defaultConfig, forgotPasswordConfig, loginConfig } from './form.config';
import FormElements from 'shared/components/formElements/FormElements';
import * as Yup from 'yup';
import Button from 'shared/components/Button';
import LoginFooter from './LoginFooter';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import dataSlice from 'store/dataSlice';
const { clearStore } = dataSlice.actions;

const { PATH_LOGIN, PATH_LOGOUT, PATH_SIGNUP, PATH_FORGOT_PASSWORD, PATH_UPDATE_PROFILE } = IAuthPath;

const Login = ({ path }: { path?: string }) => {
  const [formConfig, setFormConfig] = useState<IFormElements[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [butonNameSubmit, setButonNameSubmit] = useState('');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { login, logout } = useAuth() || {};

  const navigate = useNavigate();

  const schema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*[\]{}()?"\\,><':;|_~`=+-])[a-zA-Z\d!@#$%^&*[\]{}()?"\\,><':;|_~`=+-]{8,99}$/,
        'Must contain at least 8 Characters, 1 Uppercase, 1 Lowercase, 1 Special Character, and 1 Number'
      ),
    passwordConfirm: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const formik: FormikProps<any> = useFormik({
    initialValues: { email: 'test@test.io', password: 'Test123$' },
    onSubmit: () => {},
    validationSchema: schema,
  });

  const setlogout = async () => {
    logout?.().then(() => {
      dispatch(clearStore());
      navigate(PATH_LOGIN);
    });
  };

  useEffect(() => {
    let config: IFormElements = {};
    switch (path) {
      case PATH_LOGOUT:
        setlogout();
        break;
      case PATH_LOGIN:
        config = loginConfig();
        setButonNameSubmit(t('form.button.logIn'));
        break;
      case PATH_SIGNUP:
        config = defaultConfig();
        setButonNameSubmit(t('form.button.update'));
        break;
      case PATH_UPDATE_PROFILE:
        config = defaultConfig();
        setButonNameSubmit(t('form.button.update'));
        break;
      case PATH_FORGOT_PASSWORD:
        config = forgotPasswordConfig();
        setButonNameSubmit(t('form.button.reset'));
        break;
      default:
        break;
    }
    setFormConfig(createConfigForm(config, { prefix: 'form' }));
  }, [path]);

  const handleSubmit = async e => {
    const { email, password } = formik.values || {};
    console.log(email);
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      switch (path) {
        case PATH_LOGIN:
          login?.(email, password).then(() => navigate('/'));
          break;
        case PATH_SIGNUP:
          //  await signupUser?.(email, password);
          navigate('/');
          break;
        case PATH_UPDATE_PROFILE: {
          const promises = [];
          //  if (email !== currentUser?.email) {
          //    promises.push(updateUserEmail?.(email));
          // }
          if (password) {
            //  promises.push(updateUserPassword?.(password));
          }
          // Promise.all(promises)
          //   .then(() => {
          //     navigate('/');
          //   })
          //   .catch(() => {
          //     setMessage(t('form.errors.failUpdate'));
          //   })
          //   .finally(() => {
          //     setLoading(false);
          //   });
          break;
        }
        case PATH_FORGOT_PASSWORD:
          // await resetUserPassword?.(email);
          setMessage(t('form.info.successResetPass'));
          break;
        default:
          break;
      }
    } catch {
      onError();
    }
    setLoading(false);
  };

  const onError = (): void => {
    switch (path) {
      case PATH_LOGIN:
        setMessage(t('form.errors.failLogon'));
        break;
      case PATH_SIGNUP:
        setMessage(t('form.errors.failCreate'));
        break;
      case PATH_FORGOT_PASSWORD:
        setMessage(t('form.errors.failReset'));
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="login">
        {path !== PATH_LOGOUT ? (
          <div className="login-container">
            <form onSubmit={e => handleSubmit(e)}>
              {formConfig?.map((item, index) => (
                <div key={index} className="items">
                  <FormElements
                    key={`cell_${index}`}
                    formControlName={item.formControlName}
                    type={item.type}
                    formik={formik}
                    config={item.config}
                  />
                </div>
              ))}

              <Button
                disabled={loading || !formik.isValid}
                type="submit"
                handleClick={e => {
                  handleSubmit(e);
                }}
                className="flat filled"
              >
                {butonNameSubmit}
              </Button>
            </form>
            <LoginFooter path={path} error={message} />
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Login;
