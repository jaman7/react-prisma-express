import React, { memo } from 'react';

interface IProps {
  error?: string | null | undefined;
}

const Validator: React.FC<IProps> = ({ error }) => {
  if (!error) return null;

  return (
    <span aria-live="assertive" role="alert" className="validator">
      {error}
    </span>
  );
};

export default memo(Validator);
