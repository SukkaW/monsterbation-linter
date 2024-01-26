import { memo } from 'react';

const Spinner = () => {
  return (
    <div className="spinner">
      <div className="spinner-outer">
        <div className="spinner-inner" />
      </div>
    </div>
  );
};

export default memo(Spinner);
