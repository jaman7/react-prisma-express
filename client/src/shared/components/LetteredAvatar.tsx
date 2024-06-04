const LetteredAvatar = ({ name }: { name: string }) => {
  const getInitials = (name: string) => {
    return `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`;
  };

  const generateBackground = (name: string) => {
    let hash = 0;
    let i;

    for (i = 0; i < name.length; i += 1) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  };

  let initials = getInitials(name);
  let color = generateBackground(name);

  const customStyle = {
    display: 'flex',
    height: '40px',
    width: '40px',
    borderRadius: '50%',
    color: 'white',
    background: color,
    margin: 'auto',
  };

  return (
    <div className="avatar" style={customStyle}>
      <span style={{ margin: 'auto' }}> {initials} </span>
    </div>
  );
};

export default LetteredAvatar;
