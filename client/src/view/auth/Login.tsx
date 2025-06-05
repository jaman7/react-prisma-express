import { useAuth } from 'core/auth/userAuth';
import { FormProvider, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IFormElements, IFormElementsConfig } from 'shared/components/formElements/FormElements.model';
import { IAuthPath } from './auth.enum';
import { defaultConfig, forgotPasswordConfig, loginConfig } from './form.config';
import FormElements from 'shared/components/formElements/FormElements';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import LoginFooter from './LoginFooter';
import { useTranslation } from 'react-i18next';
import { createConfigForm } from '@/shared/utils/form-config';
import Button, { ButtonVariant } from '@/shared/components/button/Button';
import { useGlobalStore } from '@/store/useGlobalStore';

const { PATH_LOGIN, PATH_LOGOUT, PATH_SIGNUP, PATH_FORGOT_PASSWORD, PATH_UPDATE_PASSWORD } = IAuthPath;

export interface IFormData {
  email?: string | undefined;
  password?: string;
  passwpasswordConfirmord?: string;
}

interface IProps {
  path?: string;
}

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup
    .string()
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*[\]{}()?"\\,><':;|_~`=+-])[a-zA-Z\d!@#$%^&*[\]{}()?"\\,><':;|_~`=+-]{8,99}$/,
      'Must contain at least 8 Characters, 1 Uppercase, 1 Lowercase, 1 Special Character, and 1 Number'
    ),
  passwordConfirm: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
});

const Login: React.FC<IProps> = ({ path }) => {
  const [formConfig, setFormConfig] = useState<IFormElements[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [butonNameSubmit, setButonNameSubmit] = useState('');
  const { t } = useTranslation();
  const { clearStore } = useGlobalStore();
  const { login, logout } = useAuth() || {};

  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: { email: 'test@test.io', password: 'Test123$' },
  });

  const { getValues, formState } = methods;
  const { isValid } = formState;

  const setlogout = async () => {
    logout?.().then(() => {
      clearStore();
      navigate(PATH_LOGIN);
    });
  };

  useEffect(() => {
    let config: IFormElementsConfig = {};
    switch (path) {
      case PATH_LOGOUT:
        setlogout();
        break;
      case PATH_LOGIN:
        config = loginConfig();
        setButonNameSubmit(t('common.auth.buttons.logIn'));
        break;
      case PATH_SIGNUP:
        config = defaultConfig();
        setButonNameSubmit(t('common.auth.buttons.update'));
        break;
      case PATH_UPDATE_PASSWORD:
        config = defaultConfig();
        setButonNameSubmit(t('common.auth.buttons.update'));
        break;
      case PATH_FORGOT_PASSWORD:
        config = forgotPasswordConfig();
        setButonNameSubmit(t('common.auth.buttons.reset'));
        break;
      default:
        break;
    }
    setFormConfig(createConfigForm(config, { prefix: 'common.auth' }));
  }, [path]);

  const handleSubmit = async () => {
    const { email, password } = getValues() || {};

    setMessage('');
    setLoading(true);
    try {
      switch (path) {
        case PATH_LOGIN:
          login?.(email, password).then(() => navigate('/'));
          break;
        case PATH_SIGNUP:
          navigate('/');
          break;
        case PATH_UPDATE_PASSWORD: {
          break;
        }
        case PATH_FORGOT_PASSWORD:
          setMessage(t('common.auth.info.successResetPass'));
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
        setMessage(t('common.auth.errors.failLogon'));
        break;
      case PATH_SIGNUP:
        setMessage(t('common.auth.errors.failCreate'));
        break;
      case PATH_FORGOT_PASSWORD:
        setMessage(t('common.auth.errors.failReset'));
        break;
      default:
        break;
    }
  };

  return (
    <FormProvider {...methods}>
      {path !== PATH_LOGOUT ? (
        <div className="d-flex flex-column">
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            {formConfig?.map((item) => (
              <FormElements key={item.formControlName} formControlName={item?.formControlName as string} config={item.config} />
            ))}

            <Button disabled={loading || !isValid} type="submit" variant={ButtonVariant.PRIMARY} size="sm" className="mt-3">
              {butonNameSubmit}
            </Button>
          </form>
          <LoginFooter path={path} error={message} />
        </div>
      ) : (
        <></>
      )}
    </FormProvider>
  );
};

export default Login;
