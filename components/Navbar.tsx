import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { FiChevronDown, FiSettings, FiLogOut, FiLayout, FiUsers } from 'react-icons/fi';

export default function Navbar({ user }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 right-0 m-4 z-50">
      <div className="relative" ref={dropdownRef}>
        <button 
          className="flex items-center space-x-2 bg-white rounded-lg shadow-md cursor-pointer p-2 transition-all hover:shadow-lg"
          onClick={handleDropdown}
        >
          <span className="font-medium text-gray-700">{user?.name}</span>
          <FiChevronDown className={`text-gray-500 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} />
        </button>
        
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl overflow-hidden card">
            <div className="card-body px-4 py-3 border-b bg-gray-50 ">
              <h5 className="card-title text-sm font-semibold text-gray-700 ">{user?.name}</h5>
              <p className="card-text text-xs text-gray-500 ">{user?.email}</p>
            </div>
            <div className="py-2">
              <NavItem href="/feed" icon={FiLayout}>Feed</NavItem>
              <NavItem href="/create-community" icon={FiUsers}>Create Community</NavItem>
              <NavItem href="/settings" icon={FiSettings}>Settings</NavItem>
              <NavItem onClick={() => signOut()} icon={FiLogOut} className="text-red-600 hover:bg-red-50 bg-blue-50">
                Sign Out
              </NavItem>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavItem({ children, href, icon: Icon, onClick, className = "" }) {
  const content = (
    <div className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors ${className}`}>
      <Icon className="mr-3" />
      <span>{children}</span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return (
    <button className="w-full text-left" onClick={onClick}>
      {content}
    </button>
  );
}