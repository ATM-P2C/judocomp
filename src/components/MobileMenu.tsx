import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, UserCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { navItems } from './Navbar';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { appName } = useAppContext();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navigateToProfile = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <span className="text-xl font-semibold">{appName}</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={navigateToProfile}
            className="flex items-center text-sm font-medium text-gray-700"
          >
            <UserCircle className="h-6 w-6 mr-1 text-indigo-600" />
            <span>{user?.user_metadata?.first_name}</span>
          </button>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-b border-gray-200">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? 'bg-indigo-900 text-white'
                    : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-900'
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </div>
            </NavLink>
          ))}
          
          {/* Bouton de déconnexion */}
          <button
            onClick={handleLogout}
            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-100 hover:text-indigo-900"
          >
            <div className="flex items-center">
              <LogOut className="mr-3 h-5 w-5" />
              Déconnexion
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;