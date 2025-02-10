import React, { memo } from 'react';

const Loader = () => (
  <div className="scene" aria-busy="true" aria-live="polite">
    <div className="cube-wrapper">
      <div className="cube">
        <div className="cube-faces">
          <div className="cube-face shadow" aria-hidden="true"></div>
          <div className="cube-face bottom" aria-hidden="true"></div>
          <div className="cube-face top" aria-hidden="true"></div>
          <div className="cube-face left" aria-hidden="true"></div>
          <div className="cube-face right" aria-hidden="true"></div>
          <div className="cube-face back" aria-hidden="true"></div>
          <div className="cube-face front" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  </div>
);

export default memo(Loader);
