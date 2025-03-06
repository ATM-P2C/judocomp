import React, { useState } from 'react';
import { Search, Filter, Plus, Calendar, Clock, Check, Edit, Trash, QrCode, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import QRCodeGenerator from '../components/QRCodeGenerator';

const Volunteers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showQRCode, setShowQRCode] = useState<number | null>(null);
  
  // Mock data for demonstration
  const volunteers = [
    { 
      id: 1, 
      firstName: 'Jean', 
      lastName: 'Dupont', 
      club: 'Judo Club Paris', 
      role: 'Arbitre', 
      timeSlots: ['Samedi Matin', 'Samedi Après-midi'],
      points: 15,
      status: 'confirmed',
      reference: 'VOL-123456'
    },
    { 
      id: 2, 
      firstName: 'Marie', 
      lastName: 'Martin', 
      club: 'Judo Club Lyon', 
      role: 'Agent de pesée', 
      timeSlots: ['Dimanche Matin'],
      points: 5,
      status: 'confirmed',
      reference: 'VOL-234567'
    },
    { 
      id: 3, 
      firstName: 'Pierre', 
      lastName: 'Dubois', 
      club: 'Judo Club Marseille', 
      role: 'Commissaire sportif', 
      timeSlots: ['Samedi Matin', 'Samedi Après-midi', 'Dimanche Matin'],
      points: 20,
      status: 'confirmed',
      reference: 'VOL-345678'
    },
    { 
      id: 4, 
      firstName: 'Sophie', 
      lastName: 'Leroy', 
      club: 'Judo Club Bordeaux', 
      role: 'Accueil', 
      timeSlots: ['Samedi Matin'],
      points: 5,
      status: 'pending',
      reference: 'VOL-456789'
    },
    { 
      id: 5, 
      firstName: 'Thomas', 
      lastName: 'Moreau', 
      club: 'Judo Club Toulouse', 
      role: 'Arbitre', 
      timeSlots: ['Dimanche Après-midi'],
      points: 5,
      status: 'confirmed',
      reference: 'VOL-567890'
    },
    { 
      id: 6, 
      firstName: 'Julie', 
      lastName: 'Petit', 
      club: 'Judo Club Nice', 
      role: 'Commissaire sportif', 
      timeSlots: ['Samedi Après-midi', 'Dimanche Matin'],
      points: 15,
      status: 'pending',
      reference: 'VOL-678901'
    },
    { 
      id: 7, 
      firstName: 'Nicolas', 
      lastName: 'Bernard', 
      club: 'Judo Club Strasbourg', 
      role: 'Logistique', 
      timeSlots: ['Samedi Matin', 'Samedi Après-midi', 'Dimanche Matin', 'Dimanche Après-midi'],
      points: 25,
      status: 'confirmed',
      reference: 'VOL-789012'
    },
    { 
      id: 8, 
      firstName: 'Camille', 
      lastName: 'Fournier', 
      club: 'Judo Club Lille', 
      role: 'Accueil', 
      timeSlots: ['Dimanche Matin', 'Dimanche Après-midi'],
      points: 10,
      status: 'pending',
      reference: 'VOL-890123'
    },
  ];

  const filteredVolunteers = volunteers.filter(volunteer => 
    volunteer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Confirmé</span>;
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">En attente</span>;
      default:
        return null;
    }
  };

  const toggleQRCode = (id: number) => {
    setShowQRCode(id === showQRCode ? null : id);
  };

  // Calculate total points
  const totalPoints = volunteers.reduce((sum, volunteer) => sum + volunteer.points, 0);

  // Count volunteers by role
  const roleCount: Record<string, number> = {};
  volunteers.forEach(volunteer => {
    roleCount[volunteer.role] = (roleCount[volunteer.role] || 0) + 1;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestion des bénévoles</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un bénévole
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <Check className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-medium text-gray-900">Bénévoles inscrits</h3>
                <div className="mt-1 text-3xl font-semibold text-indigo-600">
                  {volunteers.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-medium text-gray-900">Créneaux couverts</h3>
                <div className="mt-1 text-3xl font-semibold text-green-600">
                  {volunteers.reduce((sum, volunteer) => sum + volunteer.timeSlots.length, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-medium text-gray-900">Points attribués</h3>
                <div className="mt-1 text-3xl font-semibold text-yellow-600">
                  {totalPoints}
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
                placeholder="Rechercher un bénévole..."
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
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Club
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créneaux
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVolunteers.map((volunteer) => (
                  <React.Fragment key={volunteer.id}>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {volunteer.lastName} {volunteer.firstName}
                            </div>
                            <div className="text-xs text-gray-500">
                              Réf: {volunteer.reference}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{volunteer.club}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {volunteer.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {volunteer.timeSlots.map((slot, index) => (
                            <span key={index} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {slot}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{volunteer.points}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(volunteer.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button 
                            onClick={() => toggleQRCode(volunteer.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Afficher QR Code"
                          >
                            <QrCode className="h-4 w-4" />
                          </button>
                          <Link 
                            to={`/badge/volunteer/${volunteer.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Imprimer badge"
                          >
                            <Printer className="h-4 w-4" />
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
                    {showQRCode === volunteer.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            <div className="text-center">
                              <QRCodeGenerator 
                                value={volunteer.reference} 
                                size={150}
                                className="mx-auto mb-2"
                              />
                              <p className="text-sm text-gray-600">
                                {volunteer.reference}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {volunteer.lastName} {volunteer.firstName} - {volunteer.role}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteers;