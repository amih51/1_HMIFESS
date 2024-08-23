import React from 'react';

const LoaderBar: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-black bg-opacity-10 z-50">
      <div className="h-full bg-blue-500 animate-loading"></div>
    </div>
  );
};

export default LoaderBar;
