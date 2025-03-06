import React, { useState, useEffect } from 'react';
import { Filter, RefreshCw, Eye, Play, Search, Calendar, Brackets, Layers, Swords } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTournaments } from '../hooks/useTournaments';
import { useCategories } from '../hooks/useCategories';
import { useMatches } from '../hooks/useMatches';

const Matches = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'matches' | 'pools' | 'brackets'>('matches');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { tournaments, loading: loadingTournaments } = useTournaments();
  const { categories, loading: loadingCategories } = useCategories(selectedTournament || undefined);
  const { matches, loading: loadingMatches } = useMatches(
    selectedTournament || undefined, 
    selectedCategory || undefined, 
    activeTab === 'upcoming' ? 'scheduled' : activeTab === 'inProgress' ? 'in_progress' : 'completed'
  );

  // Sélectionner le premier tournoi par défaut
  useEffect(() => {
    if (tournaments.length > 0 && !selectedTournament) {
      setSelectedTournament(tournaments[0].id);
    }
  }, [tournaments]);

  // Filtrer les catégories en fonction de la recherche
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Regrouper les catégories pour l'affichage des tableaux
  const uniqueCategories = [...new Set(
    matches.map(match => ({ id: match.category_id, name: match.category?.name || '' }))
      .filter(cat => cat.name)
      .map(cat => JSON.stringify(cat))
  )].map(cat => JSON.parse(cat));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Terminé</span>;
      case 'in_progress':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">En cours</span>;
      case 'scheduled':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Programmé</span>;
      default:
        return null;
    }
  };

  const getMatchStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'in_progress':
        return 'bg-yellow-50 border-yellow-200';
      case 'scheduled':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h1 className="text-2xl font-semibold text-gray-900">Gestion des combats</h1>
        <div className="flex space-x-2">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Sélection du tournoi */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 mb-4">
            <h2 className="text-lg font-medium text-gray-900">Tournois</h2>
            <div className="flex space-x-2">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={selectedTournament || ''}
                onChange={(e) => setSelectedTournament(e.target.value)}
              >
                <option value="">Tous les tournois</option>
                {tournaments.map((tournament) => (
                  <option key={tournament.id} value={tournament.id}>
                    {tournament.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loadingTournaments ? (
            <div className="text-center py-4">Chargement des tournois...</div>
          ) : tournaments.length === 0 ? (
            <div className="text-center py-4">Aucun tournoi disponible</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tournaments
                .filter(t => !selectedTournament || t.id === selectedTournament)
                .map((tournament) => (
                  <div 
                    key={tournament.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedTournament === tournament.id 
                        ? 'bg-indigo-50 border-indigo-300' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedTournament(tournament.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-md font-medium text-gray-900">{tournament.name}</h3>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className="text-xs text-gray-500">{new Date(tournament.date).toLocaleDateString()}</span>
                          {getStatusBadge(tournament.status)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{tournament.location}</p>
                      </div>
                      <div className="flex space-x-1">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <Calendar className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Modes d'affichage */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              className={`${
                viewMode === 'matches'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              onClick={() => setViewMode('matches')}
            >
              <div className="flex items-center justify-center">
                <Swords className="h-5 w-5 mr-2" />
                Combats
              </div>
            </button>
            <button
              className={`${
                viewMode === 'pools'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              onClick={() => setViewMode('pools')}
            >
              <div className="flex items-center justify-center">
                <Layers className="h-5 w-5 mr-2" />
                Poules
              </div>
            </button>
            <button
              className={`${
                viewMode === 'brackets'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              onClick={() => setViewMode('brackets')}
            >
              <div className="flex items-center justify-center">
                <Brackets className="h-5 w-5 mr-2" />
                Tableaux
              </div>
            </button>
          </nav>
        </div>
      </div>

      {viewMode === 'matches' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="-mb-px flex" aria-label="Tabs">
              <button
                className={`${
                  activeTab === 'upcoming'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 text-center border-b-2 font-medium text-sm flex-1 sm:flex-none sm:w-1/3`}
                onClick={() => setActiveTab('upcoming')}
              >
                À venir
              </button>
              <button
                className={`${
                  activeTab === 'inProgress'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 text-center border-b-2 font-medium text-sm flex-1 sm:flex-none sm:w-1/3`}
                onClick={() => setActiveTab('inProgress')}
              >
                En cours
              </button>
              <button
                className={`${
                  activeTab === 'completed'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 text-center border-b-2 font-medium text-sm flex-1 sm:flex-none sm:w-1/3`}
                onClick={() => setActiveTab('completed')}
              >
                Terminés
              </button>
            </nav>
          </div>

          <div className="px-4 py-5 sm:p-6">
            {loadingMatches ? (
              <div className="text-center py-4">Chargement des combats...</div>
            ) : matches.length === 0 ? (
              <div className="text-center py-4">Aucun combat disponible</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {activeTab === 'inProgress' ? 'Durée' : 'Heure'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phase
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Combattants
                      </th>
                      {activeTab !== 'upcoming' && (
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {activeTab === 'inProgress' ? 'Score' : 'Résultat'}
                        </th>
                      )}
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tatami
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {matches.map((match) => (
                      <tr key={match.id} className={activeTab === 'inProgress' ? 'bg-yellow-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {activeTab === 'inProgress' ? (
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {match.start_time ? new Date(match.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {match.start_time ? `${Math.floor((Date.now() - new Date(match.start_time).getTime()) / 60000)}min` : ''}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm font-medium text-gray-900">
                              {match.scheduled_time ? new Date(match.scheduled_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{match.category?.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{match.round}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <span className={match.winner_id === match.competitor1_id ? 'font-semibold text-green-600' : ''}>
                              {match.competitor1?.first_name} {match.competitor1?.last_name}
                            </span>
                            {' '}
                            <span className="text-gray-500">vs</span>
                            {' '}
                            <span className={match.winner_id === match.competitor2_id ? 'font-semibold text-green-600' : ''}>
                              {match.competitor2?.first_name} {match.competitor2?.last_name}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {match.competitor1?.club?.name} / {match.competitor2?.club?.name}
                          </div>
                        </td>
                        {activeTab !== 'upcoming' && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            {activeTab === 'inProgress' ? (
                              <div className="flex items-center justify-center space-x-2">
                                <span className="px-2 py-1 text-sm font-semibold bg-white border border-gray-300 rounded">{match.score1 || 0}</span>
                                <span className="text-gray-500">-</span>
                                <span className="px-2 py-1 text-sm font-semibold bg-white border border-gray-300 rounded">{match.score2 || 0}</span>
                              </div>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {match.win_method || 'Décision'}
                              </span>
                            )}
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            activeTab === 'inProgress' ? 'bg-yellow-100 text-yellow-800' : 
                            activeTab === 'completed' ? 'bg-gray-100 text-gray-800' : 
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {match.tatami?.name || 'Non assigné'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link to={`/match/${match.id}`} className="text-indigo-600 hover:text-indigo-900">
                            {activeTab === 'upcoming' ? (
                              <div className="flex items-center">
                                <Play className="h-4 w-4 mr-1" />
                                Démarrer
                              </div>
                            ) : activeTab === 'inProgress' ? (
                              'Gérer'
                            ) : (
                              'Détails'
                            )}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'pools' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 mb-4">
              <h2 className="text-lg font-medium text-gray-900">Poules</h2>
              <div className="w-full md:w-1/3 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Rechercher une catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loadingCategories ? (
              <div className="text-center py-4">Chargement des catégories...</div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-4">Aucune catégorie disponible</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories.map((category) => (
                  <div 
                    key={category.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedCategory === category.id 
                        ? 'bg-indigo-50 border-indigo-300' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-md font-medium text-gray-900">{category.name}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500">{category.competitors_count || 0} compétiteurs</span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Link to={`/bracket/${category.id}`} className="text-indigo-600 hover:text-indigo-900">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'brackets' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 mb-4">
              <h2 className="text-lg font-medium text-gray-900">Tableaux par catégorie</h2>
              <div className="w-full md:w-1/3 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Rechercher une catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loadingCategories ? (
              <div className="text-center py-4">Chargement des catégories...</div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-4">Aucune catégorie disponible</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredCategories.map((category) => (
                  <Link 
                    key={category.id}
                    to={`/bracket/${category.id}`}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-md font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">
                          {category.competitors_count || 0} compétiteurs
                        </p>
                      </div>
                      <Eye className="h-5 w-5 text-indigo-600" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches;