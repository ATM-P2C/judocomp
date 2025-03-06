import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, RefreshCw, Printer, Download, Eye, Play, Filter, Search } from 'lucide-react';

const TournamentView = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [viewMode, setViewMode] = useState<'pools' | 'brackets'>('pools');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for demonstration
  const tournamentData = {
    id: tournamentId,
    name: 'Championnat Régional de Judo 2025',
    date: '15/06/2025',
    location: 'Palais des Sports, Paris',
    status: 'En cours',
  };

  // Mock categories
  const categories = [
    { id: 'minimes-46', name: 'Minimes -46kg', competitors: 16, status: 'in_progress', type: 'pools_and_brackets' },
    { id: 'cadets-60', name: 'Cadets -60kg', competitors: 8, status: 'in_progress', type: 'brackets' },
    { id: 'juniors-73', name: 'Juniors -73kg', competitors: 12, status: 'scheduled', type: 'pools_and_brackets' },
    { id: 'seniors-66', name: 'Seniors -66kg', competitors: 6, status: 'completed', type: 'pools' },
    { id: 'benjamins-38', name: 'Benjamins -38kg', competitors: 20, status: 'in_progress', type: 'pools_and_brackets' },
  ];

  // Mock pools data
  const poolsData = [
    {
      id: 1,
      name: 'Poule A',
      categoryId: 'minimes-46',
      competitors: [
        { id: 1, name: 'Lucas Martin', club: 'Judo Club Paris', wins: 3, points: 30 },
        { id: 2, name: 'Thomas Dubois', club: 'Judo Club Marseille', wins: 2, points: 20 },
        { id: 3, name: 'Alexandre Petit', club: 'Judo Club Bordeaux', wins: 1, points: 10 },
        { id: 4, name: 'Nicolas Leroy', club: 'Judo Club Toulouse', wins: 0, points: 0 },
      ],
      matches: [
        { id: 1, competitor1: 'Lucas Martin', competitor2: 'Thomas Dubois', score1: 10, score2: 0, winner: 'Lucas Martin' },
        { id: 2, competitor1: 'Alexandre Petit', competitor2: 'Nicolas Leroy', score1: 10, score2: 0, winner: 'Alexandre Petit' },
        { id: 3, competitor1: 'Lucas Martin', competitor2: 'Alexandre Petit', score1: 10, score2: 0, winner: 'Lucas Martin' },
        { id: 4, competitor1: 'Thomas Dubois', competitor2: 'Nicolas Leroy', score1: 10, score2: 0, winner: 'Thomas Dubois' },
        { id: 5, competitor1: 'Lucas Martin', competitor2: 'Nicolas Leroy', score1: 10, score2: 0, winner: 'Lucas Martin' },
        { id: 6, competitor1: 'Thomas Dubois', competitor2: 'Alexandre Petit', score1: 10, score2: 0, winner: 'Thomas Dubois' },
      ]
    },
    {
      id: 2,
      name: 'Poule B',
      categoryId: 'minimes-46',
      competitors: [
        { id: 5, name: 'Maxime Dupont', club: 'Judo Club Lille', wins: 3, points: 30 },
        { id: 6, name: 'Antoine Moreau', club: 'Judo Club Nice', wins: 2, points: 20 },
        { id: 7, name: 'Julien Bernard', club: 'Judo Club Lyon', wins: 1, points: 10 },
        { id: 8, name: 'Romain Fournier', club: 'Judo Club Strasbourg', wins: 0, points: 0 },
      ],
      matches: [
        { id: 7, competitor1: 'Maxime Dupont', competitor2: 'Antoine Moreau', score1: 10, score2: 0, winner: 'Maxime Dupont' },
        { id: 8, competitor1: 'Julien Bernard', competitor2: 'Romain Fournier', score1: 0, score2: 10, winner: 'Romain Fournier' },
        { id: 9, competitor1: 'Maxime Dupont', competitor2: 'Julien Bernard', score1: 10, score2: 0, winner: 'Maxime Dupont' },
        { id: 10, competitor1: 'Antoine Moreau', competitor2: 'Romain Fournier', score1: 0, score2: 10, winner: 'Romain Fournier' },
        { id: 11, competitor1: 'Maxime Dupont', competitor2: 'Romain Fournier', score1: 10, score2: 0, winner: 'Maxime Dupont' },
        { id: 12, competitor1: 'Antoine Moreau', competitor2: 'Julien Bernard', score1: 10, score2: 0, winner: 'Antoine Moreau' },
      ]
    },
    {
      id: 3,
      name: 'Poule A',
      categoryId: 'benjamins-38',
      competitors: [
        { id: 9, name: 'Léo Girard', club: 'Judo Club Paris', wins: 2, points: 20 },
        { id: 10, name: 'Hugo Blanc', club: 'Judo Club Lyon', wins: 1, points: 10 },
        { id: 11, name: 'Mathéo Dubois', club: 'Judo Club Marseille', wins: 0, points: 0 },
      ],
      matches: [
        { id: 13, competitor1: 'Léo Girard', competitor2: 'Hugo Blanc', score1: 10, score2: 0, winner: 'Léo Girard' },
        { id: 14, competitor1: 'Léo Girard', competitor2: 'Mathéo Dubois', score1: 10, score2: 0, winner: 'Léo Girard' },
        { id: 15, competitor1: 'Hugo Blanc', competitor2: 'Mathéo Dubois', score1: 7, score2: 0, winner: 'Hugo Blanc' },
      ]
    },
  ];

  // Mock bracket data
  const bracketData = {
    categoryId: 'minimes-46',
    rounds: [
      {
        name: 'Quarts de finale',
        matches: [
          { id: 101, competitor1: 'Lucas Martin', competitor2: 'Thomas Dubois', score1: 10, score2: 0, winner: 'Lucas Martin', status: 'completed' },
          { id: 102, competitor1: 'Alexandre Petit', competitor2: 'Nicolas Leroy', score1: 0, score2: 7, winner: 'Nicolas Leroy', status: 'completed' },
          { id: 103, competitor1: 'Maxime Dupont', competitor2: 'Antoine Moreau', score1: 10, score2: 0, winner: 'Maxime Dupont', status: 'completed' },
          { id: 104, competitor1: 'Julien Bernard', competitor2: 'Romain Fournier', score1: 0, score2: 10, winner: 'Romain Fournier', status: 'completed' },
        ]
      },
      {
        name: 'Demi-finales',
        matches: [
          { id: 105, competitor1: 'Lucas Martin', competitor2: 'Nicolas Leroy', score1: 7, score2: 0, winner: 'Lucas Martin', status: 'completed' },
          { id: 106, competitor1: 'Maxime Dupont', competitor2: 'Romain Fournier', score1: 0, score2: 10, winner: 'Romain Fournier', status: 'completed' },
        ]
      },
      {
        name: 'Finale',
        matches: [
          { id: 107, competitor1: 'Lucas Martin', competitor2: 'Romain Fournier', score1: null, score2: null, winner: null, status: 'scheduled' },
        ]
      }
    ],
    repechage: [
      {
        name: 'Repêchage',
        matches: [
          { id: 108, competitor1: 'Thomas Dubois', competitor2: 'Antoine Moreau', score1: 10, score2: 0, winner: 'Thomas Dubois', status: 'completed' },
          { id: 109, competitor1: 'Alexandre Petit', competitor2: 'Julien Bernard', score1: 0, score2: 7, winner: 'Julien Bernard', status: 'completed' },
        ]
      },
      {
        name: 'Bronze',
        matches: [
          { id: 110, competitor1: 'Thomas Dubois', competitor2: 'Nicolas Leroy', score1: null, score2: null, winner: null, status: 'scheduled' },
          { id: 111, competitor1: 'Julien Bernard', competitor2: 'Maxime Dupont', score1: null, score2: null, winner: null, status: 'scheduled' },
        ]
      }
    ]
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get pools for selected category
  const categoryPools = poolsData.filter(pool => 
    pool.categoryId === (selectedCategory || filteredCategories[0]?.id)
  );

  useEffect(() => {
    if (!selectedCategory && filteredCategories.length > 0) {
      setSelectedCategory(filteredCategories[0].id);
    }
  }, [selectedCategory, filteredCategories]);

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

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <div>
          <Link to="/matches" className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mb-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour aux combats
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">{tournamentData.name}</h1>
          <p className="text-sm text-gray-500">{tournamentData.date} • {tournamentData.location} • {tournamentData.status}</p>
        </div>
        <div className="flex space-x-2">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 mb-4">
            <h2 className="text-lg font-medium text-gray-900">Catégories</h2>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-xs text-gray-500">{category.competitors} compétiteurs</span>
                      {getStatusBadge(category.status)}
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
        </div>
      </div>

      {selectedCategoryData && (
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {selectedCategoryData.name}
              </h3>
              <div className="flex space-x-2">
                {selectedCategoryData.type === 'pools_and_brackets' && (
                  <div className="flex border border-gray-300 rounded-md">
                    <button
                      className={`px-4 py-2 text-sm font-medium ${
                        viewMode === 'pools' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      } rounded-l-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      onClick={() => setViewMode('pools')}
                    >
                      Poules
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium ${
                        viewMode === 'brackets' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      } rounded-r-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      onClick={() => setViewMode('brackets')}
                    >
                      Tableau
                    </button>
                  </div>
                )}
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 py-5 sm:p-6">
            {(viewMode === 'pools' || selectedCategoryData.type === 'pools') && (
              <div className="space-y-8">
                {categoryPools.length > 0 ? (
                  categoryPools.map((pool) => (
                    <div key={pool.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3">
                        <h3 className="text-lg font-medium text-gray-900">{pool.name}</h3>
                      </div>
                      <div className="p-4">
                        <h4 className="text-md font-medium text-gray-700 mb-2">Classement</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 mb-4">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Position
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Compétiteur
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Club
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Victoires
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Points
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {pool.competitors.map((competitor, index) => (
                                <tr key={competitor.id} className={index === 0 ? 'bg-green-50' : index === 1 ? 'bg-blue-50' : ''}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">#{index + 1}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{competitor.name}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{competitor.club}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{competitor.wins}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{competitor.points}</div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <h4 className="text-md font-medium text-gray-700 mb-2">Combats</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {pool.matches.map((match) => (
                            <div key={match.id} className="border border-gray-200 rounded-md p-3">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-medium text-gray-500">Match #{match.id}</span>
                              </div>
                              <div className={`flex justify-between items-center p-2 rounded ${match.winner === match.competitor1 ? 'bg-green-50' : ''}`}>
                                <span className="text-sm font-medium">{match.competitor1}</span>
                                <span className="text-sm font-bold">{match.score1}</span>
                              </div>
                              <div className={`flex justify-between items-center p-2 rounded mt-1 ${match.winner === match.competitor2 ? 'bg-green-50' : ''}`}>
                                <span className="text-sm font-medium">{match.competitor2}</span>
                                <span className="text-sm font-bold">{match.score2}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aucune poule disponible pour cette catégorie</p>
                  </div>
                )}
              </div>
            )}

            {(viewMode === 'brackets' || selectedCategoryData.type === 'brackets') && (
              <div className="overflow-x-auto">
                <div className="min-w-max">
                  <div className="flex space-x-8">
                    {bracketData.rounds.map((round, roundIndex) => (
                      <div key={roundIndex} className="flex flex-col space-y-8">
                        <div className="text-sm font-medium text-gray-500 text-center mb-2">{round.name}</div>
                        {round.matches.map((match, matchIndex) => (
                          <div 
                            key={match.id} 
                            className={`w-64 border rounded-md p-3 ${getMatchStatusClass(match.status)}`}
                            style={{ 
                              marginTop: matchIndex > 0 ? `${Math.pow(2, roundIndex) * 4 - 4}rem` : '0' 
                            }}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-medium text-gray-500">Match #{match.id}</span>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                match.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                match.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {match.status === 'completed' ? 'Terminé' : 
                                 match.status === 'in_progress' ? 'En cours' : 
                                 'Programmé'}
                              </span>
                            </div>
                            <div className={`flex justify-between items-center p-2 rounded ${match.winner === match.competitor1 ? 'bg-green-50' : ''}`}>
                              <span className="text-sm font-medium">{match.competitor1}</span>
                              <span className="text-sm font-bold">{match.score1 !== null ? match.score1 : '-'}</span>
                            </div>
                            <div className={`flex justify-between items-center p-2 rounded mt-1 ${match.winner === match.competitor2 ? 'bg-green-50' : ''}`}>
                              <span className="text-sm font-medium">{match.competitor2}</span>
                              <span className="text-sm font-bold">{match.score2 !== null ? match.score2 : '-'}</span>
                            </div>
                            {match.status === 'scheduled' && (
                              <div className="mt-2 flex justify-end">
                                <Link to={`/match/${match.id}`} className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-900">
                                  <Play className="h-3 w-3 mr-1" />
                                  Démarrer
                                </Link>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="mt-12">
                    <div className="text-sm font-medium text-gray-500 mb-4">Repêchages et Médailles de Bronze</div>
                    <div className="flex space-x-8">
                      {bracketData.repechage.map((round, roundIndex) => (
                        <div key={roundIndex} className="flex flex-col space-y-8">
                          <div className="text-sm font-medium text-gray-500 text-center mb-2">{round.name}</div>
                          {round.matches.map((match) => (
                            <div 
                              key={match.id} 
                              className={`w-64 border rounded-md p-3 ${getMatchStatusClass(match.status)}`}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-medium text-gray-500">Match #{match.id}</span>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  match.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                  match.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {match.status === 'completed' ? 'Terminé' : 
                                   match.status === 'in_progress' ? 'En cours' : 
                                   'Programmé'}
                                </span>
                              </div>
                              <div className={`flex justify-between items-center p-2 rounded ${match.winner === match.competitor1 ? 'bg-green-50' : ''}`}>
                                <span className="text-sm font-medium">{match.competitor1}</span>
                                <span className="text-sm font-bold">{match.score1 !== null ? match.score1 : '-'}</span>
                              </div>
                              <div className={`flex justify-between items-center p-2 rounded mt-1 ${match.winner === match.competitor2 ? 'bg-green-50' : ''}`}>
                                <span className="text-sm font-medium">{match.competitor2}</span>
                                <span className="text-sm font-bold">{match.score2 !== null ? match.score2 : '-'}</span>
                              </div>
                              {match.status === 'scheduled' && (
                                <div className="mt-2 flex justify-end">
                                  <Link to={`/match/${match.id}`} className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-900">
                                    <Play className="h-3 w-3 mr-1" />
                                    Démarrer
                                  </Link>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentView;