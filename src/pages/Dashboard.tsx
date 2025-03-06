import React from 'react';
import { Users, Swords, Medal, HeartHandshake } from 'lucide-react';

const Dashboard = () => {
  // Mock data for demonstration
  const stats = [
    { name: 'Compétiteurs inscrits', value: '124', icon: Users, color: 'bg-blue-500' },
    { name: 'Combats programmés', value: '56', icon: Swords, color: 'bg-green-500' },
    { name: 'Médailles attribuées', value: '18', icon: Medal, color: 'bg-yellow-500' },
    { name: 'Bénévoles actifs', value: '32', icon: HeartHandshake, color: 'bg-purple-500' },
  ];

  const upcomingMatches = [
    { id: 1, time: '10:15', category: 'Minimes -46kg', competitor1: 'Lucas Martin', competitor2: 'Thomas Dubois', tatami: 'Tatami 1' },
    { id: 2, time: '10:20', category: 'Cadets -60kg', competitor1: 'Alexandre Petit', competitor2: 'Nicolas Leroy', tatami: 'Tatami 2' },
    { id: 3, time: '10:25', category: 'Juniors -73kg', competitor1: 'Maxime Dupont', competitor2: 'Antoine Moreau', tatami: 'Tatami 3' },
    { id: 4, time: '10:30', category: 'Seniors -66kg', competitor1: 'Julien Bernard', competitor2: 'Romain Fournier', tatami: 'Tatami 1' },
  ];

  const recentResults = [
    { id: 1, category: 'Benjamins -38kg', winner: 'Léo Girard', loser: 'Hugo Blanc', score: 'Ippon' },
    { id: 2, category: 'Minimes -42kg', winner: 'Nathan Rousseau', loser: 'Mathis Lambert', score: 'Waza-ari' },
    { id: 3, category: 'Cadets -55kg', winner: 'Enzo Mercier', loser: 'Louis Bonnet', score: 'Ippon' },
    { id: 4, category: 'Juniors -81kg', winner: 'Théo Guerin', loser: 'Paul Faure', score: 'Ippon' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Tableau de bord</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Matches */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Prochains combats</h3>
          </div>
          <div className="overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {upcomingMatches.map((match) => (
                <li key={match.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-indigo-600 truncate">{match.category}</p>
                      <p className="flex items-center text-sm text-gray-500">
                        <span className="truncate">{match.competitor1}</span>
                        <span className="mx-1">vs</span>
                        <span className="truncate">{match.competitor2}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm font-semibold text-gray-900">{match.time}</p>
                      <p className="text-sm text-gray-500">{match.tatami}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Results */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Résultats récents</h3>
          </div>
          <div className="overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {recentResults.map((result) => (
                <li key={result.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-indigo-600 truncate">{result.category}</p>
                      <p className="flex items-center text-sm text-gray-500">
                        <span className="font-medium text-green-600">{result.winner}</span>
                        <span className="mx-1">vs</span>
                        <span className="text-gray-600">{result.loser}</span>
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {result.score}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;