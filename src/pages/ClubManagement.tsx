import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Save, Plus, Trash, Mail, 
  UserPlus, Key, Shield, User, Users
} from 'lucide-react';

const ClubManagement = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('members');
  
  // Mock data for demonstration
  const clubData = {
    id: clubId,
    name: 'Judo Club Paris',
    address: '15 Rue du Judo, 75001 Paris',
    contactName: 'Jean Dupont',
    contactEmail: 'contact@judoclubparis.fr',
    contactPhone: '01 23 45 67 89',
    logo: 'https://images.unsplash.com/photo-1583290173631-9ad7d6c051f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    members: [
      { 
        id: 1, 
        firstName: 'Jean', 
        lastName: 'Dupont', 
        email: 'jean.dupont@example.com', 
        role: 'owner', 
        lastLogin: '2023-05-15'
      },
      { 
        id: 2, 
        firstName: 'Marie', 
        lastName: 'Martin', 
        email: 'marie.martin@example.com', 
        role: 'admin', 
        lastLogin: '2023-05-10'
      },
      { 
        id: 3, 
        firstName: 'Pierre', 
        lastName: 'Dubois', 
        email: 'pierre.dubois@example.com', 
        role: 'coach', 
        lastLogin: '2023-05-05'
      },
      { 
        id: 4, 
        firstName: 'Sophie', 
        lastName: 'Leroy', 
        email: 'sophie.leroy@example.com', 
        role: 'member', 
        lastLogin: '2023-04-28'
      },
    ],
    competitors: [
      { id: 1, firstName: 'Lucas', lastName: 'Martin', age: 13, category: 'Minimes -46kg' },
      { id: 2, firstName: 'Emma', lastName: 'Bernard', age: 11, category: 'Benjamins -40kg' },
      { id: 3, firstName: 'Thomas', lastName: 'Dubois', age: 13, category: 'Minimes -46kg' },
      { id: 4, firstName: 'Léa', lastName: 'Petit', age: 12, category: 'Benjamins -44kg' },
    ]
  };

  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'member'
  });

  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    // Dans une application réelle, vous enverriez ces données à l'API
    console.log('Nouveau membre', newMember);
    
    // Réinitialiser le formulaire
    setNewMember({
      firstName: '',
      lastName: '',
      email: '',
      role: 'member'
    });
    setShowAddMemberForm(false);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Dans une application réelle, vous enverriez une demande de réinitialisation de mot de passe
    console.log('Réinitialisation du mot de passe pour', resetEmail);
    
    // Afficher un message de confirmation
    alert(`Un email de réinitialisation a été envoyé à ${resetEmail}`);
    
    // Réinitialiser le formulaire
    setResetEmail('');
    setShowResetPasswordForm(false);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Propriétaire</span>;
      case 'admin':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Administrateur</span>;
      case 'coach':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Entraîneur</span>;
      case 'member':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Membre</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button 
            onClick={() => navigate('/clubs')}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour aux clubs
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Gestion du club</h1>
          <p className="text-sm text-gray-500">{clubData.name}</p>
        </div>
        <div>
          <button
            onClick={() => {}}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              className={`${
                activeTab === 'members'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 text-center border-b-2 font-medium text-sm flex-1 sm:flex-none sm:w-1/3`}
              onClick={() => setActiveTab('members')}
            >
              Membres
            </button>
            <button
              className={`${
                activeTab === 'competitors'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 text-center border-b-2 font-medium text-sm flex-1 sm:flex-none sm:w-1/3`}
              onClick={() => setActiveTab('competitors')}
            >
              Compétiteurs
            </button>
            <button
              className={`${
                activeTab === 'settings'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 text-center border-b-2 font-medium text-sm flex-1 sm:flex-none sm:w-1/3`}
              onClick={() => setActiveTab('settings')}
            >
              Paramètres
            </button>
          </nav>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {activeTab === 'members' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Membres du club</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowResetPasswordForm(true)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Réinitialiser mot de passe
                  </button>
                  <button
                    onClick={() => setShowAddMemberForm(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ajouter un membre
                  </button>
                </div>
              </div>

              {showAddMemberForm && (
                <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Ajouter un nouveau membre</h3>
                  <form onSubmit={handleAddMember}>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                          Prénom
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="first-name"
                            id="first-name"
                            value={newMember.firstName}
                            onChange={(e) => setNewMember({...newMember, firstName: e.target.value})}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                          Nom
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="last-name"
                            id="last-name"
                            value={newMember.lastName}
                            onChange={(e) => setNewMember({...newMember, lastName: e.target.value})}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={newMember.email}
                            onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                          Rôle
                        </label>
                        <div className="mt-1">
                          <select
                            id="role"
                            name="role"
                            value={newMember.role}
                            onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="member">Membre</option>
                            <option value="coach">Entraîneur</option>
                            <option value="admin">Administrateur</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Ajouter
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => setShowAddMemberForm(false)}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {showResetPasswordForm && (
                <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Réinitialiser le mot de passe</h3>
                  <form onSubmit={handleResetPassword}>
                    <div className="sm:col-span-4">
                      <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                        Email du membre
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="reset-email"
                          id="reset-email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Un email sera envoyé à cette adresse avec les instructions pour réinitialiser le mot de passe.
                      </p>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Envoyer
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => setShowResetPasswordForm(false)}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dernière connexion
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clubData.members.map((member) => (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {member.lastName} {member.firstName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{member.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(member.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.lastLogin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2 justify-end">
                            <button className="text-indigo-600 hover:text-indigo-900">
                              <Shield className="h-4 w-4" />
                            </button>
                            <button className="text-blue-600 hover:text-blue-900">
                              <Mail className="h-4 w-4" />
                            </button>
                            {member.role !== 'owner' && (
                              <button className="text-red-600 hover:text-red-900">
                                <Trash className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'competitors' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Compétiteurs du club</h2>
                <button
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un compétiteur
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clubData.competitors.map((competitor) => (
                      <tr key={competitor.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {competitor.lastName} {competitor.firstName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {competitor.age} ans
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {competitor.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2 justify-end">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubManagement;