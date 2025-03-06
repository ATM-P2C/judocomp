import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash, Upload, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Clubs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for demonstration
  const clubs = [
    { 
      id: 1, 
      name: 'Judo Club Paris', 
      address: '15 Rue du Judo, 75001 Paris',
      contactName: 'Jean Dupont',
      contactEmail: 'contact@judoclubparis.fr',
      contactPhone: '01 23 45 67 89',
      competitors: 15,
      volunteers: 5,
      logo: 'https://images.unsplash.com/photo-1583290173631-9ad7d6c051f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    { 
      id: 2, 
      name: 'Judo Club Lyon', 
      address: '25 Avenue des Sports, 69001 Lyon',
      contactName: 'Marie Martin',
      contactEmail: 'contact@judoclublyon.fr',
      contactPhone: '04 56 78 90 12',
      competitors: 12,
      volunteers: 3,
      logo: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    { 
      id: 3, 
      name: 'Judo Club Marseille', 
      address: '8 Boulevard du Tatami, 13001 Marseille',
      contactName: 'Pierre Dubois',
      contactEmail: 'contact@judoclubmarseille.fr',
      contactPhone: '04 91 23 45 67',
      competitors: 10,
      volunteers: 4,
      logo: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    { 
      id: 4, 
      name: 'Judo Club Bordeaux', 
      address: '12 Rue des Arts Martiaux, 33000 Bordeaux',
      contactName: 'Sophie Leroy',
      contactEmail: 'contact@judoclubbordeaux.fr',
      contactPhone: '05 56 78 90 12',
      competitors: 8,
      volunteers: 2,
      logo: 'https://images.unsplash.com/photo-1550684847-75bdda21cc95?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    { 
      id: 5, 
      name: 'Judo Club Toulouse', 
      address: '5 Place du Dojo, 31000 Toulouse',
      contactName: 'Thomas Moreau',
      contactEmail: 'contact@judoclubtoulouse.fr',
      contactPhone: '05 61 23 45 67',
      competitors: 9,
      volunteers: 3,
      logo: null
    },
  ];

  const filteredClubs = clubs.filter(club => 
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h1 className="text-2xl font-semibold text-gray-900">Gestion des clubs</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un club
        </button>
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
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Club
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adresse
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClubs.map((club) => (
                  <tr key={club.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full overflow-hidden">
                          {club.logo ? (
                            <img src={club.logo} alt={club.name} className="h-10 w-10 object-cover" />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center bg-indigo-100 text-indigo-500">
                              {club.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{club.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{club.contactName}</div>
                      <div className="text-sm text-gray-500">{club.contactEmail}</div>
                      <div className="text-sm text-gray-500">{club.contactPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{club.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {club.competitors} compétiteurs
                        </span>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {club.volunteers} bénévoles
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <Link to={`/club/${club.id}`} className="text-indigo-600 hover:text-indigo-900">
                          <Users className="h-4 w-4" />
                        </Link>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
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

export default Clubs;