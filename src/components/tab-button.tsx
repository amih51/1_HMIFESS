import React from 'react';

type TabButtonProps = {
  active: boolean;
  selectTab: (tabName: string) => void;
  children: string | JSX.Element;
};

/**
 * A tab button. Shows the tab name and changes color when clicked.
 * @param {TabButtonProps} props
 * @returns {JSX.Element}
 */
const TabButton = ({ active, selectTab, children }: TabButtonProps): JSX.Element => {
  const buttonClasses = active
    ? "text-black border-b-2 border-black px-5 py-2"
    : "text-black text-opacity-50 px-5 py-2";

  return (
    <button
      onClick={() => {
        if (typeof children === 'string') {
          selectTab(children);
        } else {
          console.error('Children must be a string');
        }
      }}
      className={`mr-5 font-semibold ${buttonClasses}`}>
      {children}
    </button>
  );
};

export default TabButton