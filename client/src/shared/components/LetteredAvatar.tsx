import { Tooltip } from 'primereact/tooltip';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  name: string;
  size?: number;
  tooltipText?: string;
}

const LetteredAvatar: React.FC<IProps> = ({ name, size = 40, tooltipText = '' }) => {
  const { t } = useTranslation();
  const getInitials = useMemo(() => {
    const nameParts = name.split(' ');
    if (nameParts.length < 2) return name[0].toUpperCase();
    return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
  }, [name]);

  const generateBackground = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      const adjustedValue = Math.min(value, 128);
      color += `00${adjustedValue.toString(16)}`.slice(-2);
    }
    return color;
  }, [name]);

  const customStyle = useMemo(
    () => ({
      display: 'flex',
      height: `${size}px`,
      width: `${size}px`,
      borderRadius: '50%',
      backgroundColor: generateBackground,
      color: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500,
      fontSize: `${size / 2.5}px`,
      lineHeight: 1,
      cursor: 'cross',
    }),
    [size, generateBackground]
  );

  return (
    <>
      <div
        id="LetteredAvatar"
        className="avatar"
        style={customStyle}
        aria-label={`Avatar for ${name}`}
        data-pr-tooltip={t(tooltipText || '')}
        data-pr-classname="target-tooltip shadow-none"
        data-pr-position="top"
      >
        <span>{getInitials}</span>
      </div>
      <Tooltip target="#LetteredAvatar" />
    </>
  );
};

export default LetteredAvatar;
