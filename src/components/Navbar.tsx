import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Tag, 
  Weight, 
  Swords, 
  Medal, 
  HeartHandshake, 
  Trophy, 
  Settings,
  Image,
  Layers,
  Timer,
  LogOut,
  UserCircle,
  Coffee
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const navItems = [
  { name: 'Tableau de bord', path: '/', icon: LayoutDashboard },
  { name: 'Compétiteurs', path: '/competitors', icon: Users },
  { name: 'Pesée', path: '/weighing', icon: Weight },
  { name: 'Combats', path: '/matches', icon: Swords },
  { name: 'Surfaces', path: '/surfaces', icon: Layers },
  { name: 'Résultats', path: '/results', icon: Medal },
  { name: 'Bénévoles', path: '/volunteers', icon: HeartHandshake },
  { name: 'Challenge', path: '/challenge', icon: Trophy },
  { name: 'Clubs', path: '/clubs', icon: Image },
  { name: 'Buvette', path: '/refreshment-stand', icon: Coffee },
  { name: 'Paramètres', path: '/settings', icon: Settings },
];

const Navbar = () => {
  const { appName, appLogo } = useAppContext();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navigateToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-indigo-800">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            {appLogo ? (
              <img src={appLogo} alt={appName} className="h-8 w-auto" />
            ) : (
              <Trophy className="h-8 w-8 text-white" />
            )}
            <span className="ml-2 text-white text-xl font-semibold">{appName}</span>
          </div>
          
          {/* User profile at the top of navbar */}
          <div className="mt-4 px-4">
            <button
              onClick={navigateToProfile}
              className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-600"
            >
              <UserCircle className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</span>
                <span className="text-xs text-indigo-300">Mon profil</span>
              </div>
            </button>
          </div>
          
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-indigo-900 text-white'
                      : 'text-indigo-100 hover:bg-indigo-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'
                      }`}
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          
          {/* Bouton de déconnexion */}
          <div className="px-2 pb-4 mt-auto">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-700"
            >
              <LogOut className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300 group-hover:text-white" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;