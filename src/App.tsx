import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import Navbar from './components/Navbar';
import MobileMenu from './components/MobileMenu';
import Dashboard from './pages/Dashboard';
import Competitors from './pages/Competitors';
import Categories from './pages/Categories';
import Weighing from './pages/Weighing';
import Matches from './pages/Matches';
import MatchManager from './pages/MatchManager';
import Results from './pages/Results';
import Volunteers from './pages/Volunteers';
import Challenge from './pages/Challenge';
import Clubs from './pages/Clubs';
import ClubManagement from './pages/ClubManagement';
import Settings from './pages/Settings';
import BracketView from './pages/BracketView';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import UserProfile from './pages/UserProfile';
import CompetitorForm from './pages/CompetitorForm';
import BadgePrint from './pages/BadgePrint';
import ClubForm from './pages/ClubForm';
import CategoryForm from './pages/CategoryForm';
import SurfaceForm from './pages/SurfaceForm';
import VolunteerForm from './pages/VolunteerForm';
import TournamentForm from './pages/TournamentForm';
import Tournaments from './pages/Tournaments';
import SurfaceManagement from './pages/SurfaceManagement';
import RefreshmentStand from './pages/RefreshmentStand';
import RefreshmentStandSettings from './pages/RefreshmentStandSettings';
import { AppProvider, useAppContext } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import NewTournamentModal from './components/NewTournamentModal';
import TournamentDropdown from './components/TournamentDropdown';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const { appName, appLogo } = useAppContext();
  const { user, loading } = useAuth();
  const [isNewTournamentModalOpen, setIsNewTournamentModalOpen] = useState(false);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <MobileMenu />
        <header className="bg-white shadow-sm z-10 hidden md:block">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center">
              {appLogo ? (
                <img src={appLogo} alt={appName} className="h-8 w-auto mr-3" />
              ) : (
                <Trophy className="h-8 w-8 text-indigo-600 mr-3" />
              )}
              <h1 className="text-2xl font-bold text-gray-900">{appName}</h1>
            </div>
            <TournamentDropdown onNewTournamentClick={() => setIsNewTournamentModalOpen(true)} />
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/competitors" element={<Competitors />} />
              <Route path="/competitor/new" element={<CompetitorForm />} />
              <Route path="/competitor/edit/:id" element={<CompetitorForm />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/new" element={<CategoryForm />} />
              <Route path="/category/edit/:id" element={<CategoryForm />} />
              <Route path="/weighing" element={<Weighing />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/match/:matchId" element={<MatchManager />} />
              <Route path="/results" element={<Results />} />
              <Route path="/volunteers" element={<Volunteers />} />
              <Route path="/volunteer/new" element={<VolunteerForm />} />
              <Route path="/volunteer/edit/:id" element={<VolunteerForm />} />
              <Route path="/challenge" element={<Challenge />} />
              <Route path="/clubs" element={<Clubs />} />
              <Route path="/club/new" element={<ClubForm />} />
              <Route path="/club/edit/:id" element={<ClubForm />} />
              <Route path="/club/:clubId" element={<ClubManagement />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/bracket/:categoryId" element={<BracketView />} />
              <Route path="/surfaces" element={<SurfaceManagement />} />
              <Route path="/surface/new" element={<SurfaceForm />} />
              <Route path="/surface/edit/:id" element={<SurfaceForm />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/tournament/new" element={<TournamentForm />} />
              <Route path="/tournament/edit/:id" element={<TournamentForm />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/badge/competitor/:id" element={<BadgePrint type="competitor" />} />
              <Route path="/badge/volunteer/:id" element={<BadgePrint type="volunteer" />} />
              <Route path="/refreshment-stand" element={<RefreshmentStand />} />
              <Route path="/refreshment-stand/settings" element={<RefreshmentStandSettings />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
      
      <NewTournamentModal 
        isOpen={isNewTournamentModalOpen} 
        onClose={() => setIsNewTournamentModalOpen(false)} 
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;