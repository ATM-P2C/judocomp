import React, { useState } from 'react';
import { Search, Filter, Medal, Award, Users } from 'lucide-react';

const ClubChallenge = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for demonstration
  const clubs = [
    { 
      id: 1, 
      name: 'Judo Club Paris', 
      medals: { gold: 3, silver: 1, bronze: 2 }, 
      volunteers: 12,
      volunteerPoints: 75,
      totalPoints: 117,
    },
    { 
      id: 2, 
      name: 'Judo Club Lyon', 
      medals: { gold: 2, silver: 2, bronze: 0 }, 
      volunteers: 8,
      volunteerPoints: 45,
      totalPoints: 85,
    },
    { 
      id: 3, 
      name: 'Judo Club Marseille', 
      medals: { gold: 0, silver: 2, bronze: 1 }, 
      volunteers: 6,
      volunteerPoints: 30,
      totalPoints: 45,
    },
    { 
      id: 4, 
      name: 'Judo Club Bordeaux', 
      medals: { gold: 1, silver: 0, bronze: 2 }, 
      volunteers: 5,
      volunteerPoints: 25,
      totalPoints: 42,
    },
    { 
      id: 5, 
      name: 'Judo Club Toulouse', 
      medals: { gold: 0, silver: 1, bronze: 2 }, 
      volunteers: 7,
      volunteerPoints: 35,
      totalPoints: 47,
    },
    { 
      id: 6, 
      name: 'Judo Club Nice', 
      medals: { gold: 0, silver: 1, bronze: 1 }, 
      volunteers: 4,
      volunteerPoints: 20,
      totalPoints: 30,
    },
    { 
      id: 7, 
      name: 'Judo Club Strasbourg', 
      medals: { gold: 0, silver: 1, bronze: 0 }, 
      volunteers: 3,
      volunteerPoints: 15,
      totalPoints: 20,
    },
    { 
      id: 8, 
      name: 'Judo Club Lille', 
      medals: { gold: 1, silver: 0, bronze: 0 }, 
      volunteers: 2,
      volunteerPoints: 10,
      totalPoints: 25,
    },
  ];

  // Sort clubs by total points
  const sortedClubs = [...clubs].sort((a, b) => b.totalPoints - a.totalPoints);

  const filteredClubs = sortedClubs.filter(club => 
    club.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate medal points
  const calculateMedalPoints = (medals: { gold: number, silver: number, bronze: number }) => {
    return (medals.gold * 10) + (medals.silver * 5) + (medals.bronze * 2);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Challenge des clubs</h1>
        <div className="flex space-x-2">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </button>
        </div>
      </div>

      {/* Top 3 Clubs Podium */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Podium des clubs</h2>
          <div className="flex flex-col md:flex-row items-end justify-center space-y-4 md:space-y-0 md:space-x-8 py-4">
            {/* Second Place */}
            {sortedClubs.length > 1 && (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-4xl font-bold text-gray-600">2</span>
                </div>
                <div className="h-32 w-24 bg-gray-200 rounded-t-lg flex items-end justify-center">
                  <div className="text-center pb-2">
                    <p className="font-semibold text-gray-800">{sortedClubs[1].name}</p>
                    <p className="text-sm text-gray-600">{sortedClubs[1].totalPoints} pts</p>
                  </div>
                </div>
              </div>
            )}

            {/* First Place */}
            {sortedClubs.length > 0 && (
              <div className="flex flex-col items-center">
                <div className="w-28 h-28 bg-yellow-100 rounded-full flex items-center justify-center mb-2 border-2 border-yellow-400">
                  <span className="text-5xl font-bold text-yellow-600">1</span>
                </div>
                <div className="h-40 w-28 bg-yellow-200 rounded-t-lg flex items-end justify-center">
                  <div className="text-center pb-2">
                    <p className="font-semibold text-gray-800">{sortedClubs[0].name}</p>
                    <p className="text-sm text-gray-600">{sortedClubs[0].totalPoints} pts</p>
                  </div>
                </div>
              </div>
            )}

            {/* Third Place */}
            {sortedClubs.length > 2 && (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold text-amber-600">3</span>
                </div>
                <div className="h-24 w-20 bg-amber-100 rounded-t-lg flex items-end justify-center">
                  <div className="text-center pb-2">
                    <p className="font-semibold text-gray-800">{sortedClubs[2].name}</p>
                    <p className="text-sm text-gray-600">{sortedClubs[2].totalPoints} pts</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Club Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <Medal className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-medium text-gray-900">Total des médailles</h3>
                <div className="mt-1 text-3xl font-semibold text-yellow-600">
                  {clubs.reduce((sum, club) => sum + club.medals.gold + club.medals.silver + club.medals.bronze, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-medium text-gray-900">Bénévoles impliqués</h3>
                <div className="mt-1 text-3xl font-semibold text-indigo-600">
                  {clubs.reduce((sum, club) => sum + club.volunteers, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-medium text-gray-900">Points totaux</h3>
                <div className="mt-1 text-3xl font-semibold text-green-600">
                  {clubs.reduce((sum, club) => sum + club.totalPoints, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 mb-4">
            <div className="w-full md:w-1/3 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Rechercher un club..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rang
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Club
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Médailles
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points médailles
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bénévoles
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points bénévoles
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total des points
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClubs.map((club, index) => (
                  <tr key={club.id} className={index < 3 ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{index + 1}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{club.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Or: {club.medals.gold}
                        </span>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Argent: {club.medals.silver}
                        </span>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                          Bronze: {club.medals.bronze}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{calculateMedalPoints(club.medals)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{club.volunteers}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{club.volunteerPoints}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-indigo-600">{club.totalPoints}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubChallenge;