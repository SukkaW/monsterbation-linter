import { memo } from 'react';

function Spinner() {
  return (
    <div className="spinner">
      <div className="spinner-outer">
        <div className="spinner-inner" />
      </div>
    </div>
  );
}

export default memo(Spinner);
