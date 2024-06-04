import { useAuth } from 'core/auth/userAuth';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Button from 'shared/components/Button';
import LazyImage from 'shared/components/LazyImage';
import { IUser } from 'store/data.model';
import { IRootState } from 'store/store';
import { FaCriticalRole } from 'react-icons/fa';
import { FaRegCircleUser, FaPhone, FaLocationDot } from 'react-icons/fa6';
import { FiMail } from 'react-icons/fi';

const UserProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const { t } = useTranslation();
  const user: IUser = useSelector((state: IRootState) => state?.dataSlice.user ?? {});
  const { name, lastName, email, title, phone, location, role } = user || {};

  const buttonTextEditing = () =>
    isEdit ? t('userProfile.button.finish') : t('userProfile.button.view', { value: `${name} ${lastName}` });

  const handleEdit = () => {
    if (!isEdit) {
      setIsEdit(true);
    } else {
      // setIsEdit(false);
    }
  };

  const urlUserImage = (image: string): JSX.Element => {
    const svgStr = image ?? '';
    const svg = new Blob([svgStr], { type: 'image/svg+xml' });
    const img =
      svg?.size !== 0 ? (
        <LazyImage src={URL.createObjectURL(svg)} alt="Logo" className="user-logo img-fluid lazyload" />
      ) : (
        <i className="user-logo-default">
          <FaRegCircleUser />
        </i>
      );
    return img;
  };

  const userData = [
    {
      icon: <FaCriticalRole />,
      name: t('userProfile.role'),
      value: role,
    },
    {
      icon: <FaRegCircleUser />,
      name: t('userProfile.title'),
      value: title,
    },
    {
      icon: <FiMail />,
      name: t('userProfile.email'),
      value: email,
    },
    {
      icon: <FaPhone />,
      name: t('userProfile.phone'),
      value: phone,
    },
    {
      icon: <FaLocationDot />,
      name: t('userProfile.location'),
      value: location,
    },
  ];

  return (
    <>
      <div className="user-profile">
        <div className="user-profile-header">
          <Button handleClick={() => handleEdit()}>{buttonTextEditing?.()}</Button>

          {urlUserImage?.(user?.image as string)}

          <h2 className="info">
            {name} {lastName}
          </h2>
        </div>

        <div className="user-profile-body">
          <h3>Overview</h3>
          <div className="user-profile-body__content">
            {userData?.map((el, i) => (
              <div key={i} className="info">
                <i>{el.icon}</i>
                <span className="prefix">{el.name}:</span> <span className="value">{el.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
