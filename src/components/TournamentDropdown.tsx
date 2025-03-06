import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTournaments } from '../hooks/useTournaments';
import { Link } from 'react-router-dom';

interface TournamentDropdownProps {
  onNewTournamentClick: () => void;
}

const TournamentDropdown: React.FC<TournamentDropdownProps> = ({ onNewTournamentClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { tournaments, loading } = useTournaments();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter active tournaments (published or in progress)
  const activeTournaments = tournaments.filter(t => 
    t.status === 'published' || t.status === 'in_progress'
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center space-x-4">
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white text-gray-700 px-4 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
        >
          <span>Compétitions actives</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </button>
        
        {isOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {loading ? (
                <div className="px-4 py-2 text-sm text-gray-500">Chargement...</div>
              ) : activeTournaments.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500">Aucune compétition active</div>
              ) : (
                activeTournaments.map(tournament => (
                  <Link
                    key={tournament.id}
                    to={`/tournament/${tournament.id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                  >
                    {tournament.name}
                    <span className="block text-xs text-gray-500">
                      {new Date(tournament.date).toLocaleDateString()}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
      <button 
        onClick={onNewTournamentClick}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Nouvelle compétition
      </button>
    </div>
  );
};

export default TournamentDropdown;