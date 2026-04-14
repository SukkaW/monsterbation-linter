import { memo } from 'react';

export default memo(function Spinner() {
  return (
    <div className="spinner">
      <div className="spinner-outer">
        <div className="spinner-inner" />
      </div>
    </div>
  );
});
