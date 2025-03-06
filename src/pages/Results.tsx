import React, { useState } from 'react';
import { Search, Filter, Download, Check } from 'lucide-react';

const Results = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Mock data for demonstration
  const categories = [
    { id: 'all', name: 'Toutes les catégories' },
    { id: 'benjamins-38', name: 'Benjamins -38kg' },
    { id: 'minimes-46', name: 'Minimes -46kg' },
    { id: 'cadets-60', name: 'Cadets -60kg' },
    { id: 'juniors-73', name: 'Juniors -73kg' },
    { id: 'seniors-66', name: 'Seniors -66kg' },
  ];

  const completedResults = [
    { 
      id: 1, 
      category: 'Benjamins -38kg', 
      gold: { name: 'Léo Girard', club: 'Judo Club Paris' },
      silver: { name: 'Hugo Blanc', club: 'Judo Club Lyon' },
      bronze1: { name: 'Mathéo Dubois', club: 'Judo Club Marseille' },
      bronze2: { name: 'Nolan Petit', club: 'Judo Club Bordeaux' },
      medalsAwarded: true
    },
    { 
      id: 2, 
      category: 'Minimes -46kg', 
      gold: { name: 'Lucas Martin', club: 'Judo Club Paris' },
      silver: { name: 'Thomas Dubois', club: 'Judo Club Marseille' },
      bronze1: { name: 'Enzo Leroy', club: 'Judo Club Toulouse' },
      bronze2: { name: 'Maxence Bernard', club: 'Judo Club Lyon' },
      medalsAwarded: false
    },
  ];

  const upcomingResults = [
    { 
      id: 3, 
      category: 'Cadets -60kg', 
      status: 'in_progress',
      progress: 75,
      estimatedCompletion: '15:30'
    },
    { 
      id: 4, 
      category: 'Juniors -73kg', 
      status: 'in_progress',
      progress: 50,
      estimatedCompletion: '16:15'
    },
  ];

  const recentMatches = [
    { id: 101, category: 'Cadets -60kg', competitor1: 'Alexandre Petit', competitor2: 'Nicolas Leroy', winner: 'Alexandre Petit', score: 'Ippon', time: '15:05' },
    { id: 102, category: 'Juniors -73kg', competitor1: 'Maxime Dupont', competitor2: 'Antoine Moreau', winner: 'Maxime Dupont', score: 'Waza-ari', time: '15:02' },
    { id: 103, category: 'Cadets -60kg', competitor1: 'Julien Bernard', competitor2: 'Romain Fournier', winner: 'Romain Fournier', score: 'Ippon', time: '14:55' },
    { id: 104, category: 'Juniors -73kg', competitor1: 'Théo Guerin', competitor2: 'Paul Faure', winner: 'Théo Guerin', score: 'Décision', time: '14:48' },
  ];

  const filteredCompletedResults = completedResults.filter(result => 
    selectedCategory === 'all' || result.category === selectedCategory
  );

  const filteredUpcomingResults = upcomingResults.filter(result => 
    selectedCategory === 'all' || result.category === selectedCategory
  );

  const filteredRecentMatches = recentMatches.filter(match => 
    (selectedCategory === 'all' || match.category === selectedCategory) &&
    (searchTerm === '' || 
      match.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.competitor1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.competitor2.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const markMedalsAwarded = (resultId: number) => {
    // Dans une application réelle, vous enverriez une requête à l'API
    console.log(`Médailles remises pour le résultat ${resultId}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Résultats</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <Download className="h-4 w-4 mr-2" />
          Exporter les résultats
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 mb-6">
        <div className="w-full md:w-1/3 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <select
            id="category"
            name="category"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </button>
        </div>
      </div>

      {/* Résultats à venir */}
      {filteredUpcomingResults.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Résultats à venir</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Catégories en cours de compétition</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {filteredUpcomingResults.map((result) => (
                <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{result.category}</h4>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      En cours
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full" 
                        style={{ width: `${result.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">{result.progress}% terminé</span>
                      <span className="text-xs text-gray-500">Fin estimée: {result.estimatedCompletion}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Résultats récents */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Derniers combats</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Résultats des combats récents</p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Heure
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Combattants
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Résultat
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecentMatches.map((match) => (
                  <tr key={match.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{match.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{match.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm ${match.winner === match.competitor1 ? 'font-bold text-green-600' : ''}`}>
                          {match.competitor1}
                        </span>
                        <span className="mx-2 text-gray-500">vs</span>
                        <span className={`text-sm ${match.winner === match.competitor2 ? 'font-bold text-green-600' : ''}`}>
                          {match.competitor2}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {match.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Résultats finaux */}
      {filteredCompletedResults.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Résultats finaux</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Catégories terminées</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-8">
              {filteredCompletedResults.map((result) => (
                <div key={result.id} className={`border ${result.medalsAwarded ? 'border-green-200 bg-green-50' : 'border-gray-200'} rounded-lg p-4`}>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-gray-900">{result.category}</h4>
                    {result.medalsAwarded ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Médailles remises
                      </span>
                    ) : (
                      <button
                        onClick={() => markMedalsAwarded(result.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Marquer comme remis
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                      <div className="text-xs font-medium text-yellow-800 mb-1">Or</div>
                      <div className="text-sm font-medium text-gray-900">{result.gold.name}</div>
                      <div className="text-xs text-gray-500">{result.gold.club}</div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                      <div className="text-xs font-medium text-gray-800 mb-1">Argent</div>
                      <div className="text-sm font-medium text-gray-900">{result.silver.name}</div>
                      <div className="text-xs text-gray-500">{result.silver.club}</div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                      <div className="text-xs font-medium text-amber-800 mb-1">Bronze</div>
                      <div className="text-sm font-medium text-gray-900">{result.bronze1.name}</div>
                      <div className="text-xs text-gray-500">{result.bronze1.club}</div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                      <div className="text-xs font-medium text-amber-800 mb-1">Bronze</div>
                      <div className="text-sm font-medium text-gray-900">{result.bronze2.name}</div>
                      <div className="text-xs text-gray-500">{result.bronze2.club}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;