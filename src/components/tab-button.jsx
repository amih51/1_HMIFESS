import React from 'react';

const TabButton = ({active, selectTab, children}) => {
  const buttonClasses = active
        ? "text-white border-b-2 border-white px-5 py-2"
        : "text-white text-opacity-50 px-5 py-2";

    return (
    <button
        onClick={selectTab}
        className={`mr-5 font-semibold ${buttonClasses}`}>
            {children}
    </button>
  );
};

export default TabButton