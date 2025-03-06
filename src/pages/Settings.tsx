import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Trash, Plus, Upload, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { appName, setAppName, appLogo, setAppLogo, primaryColor, setPrimaryColor } = useAppContext();
  const [tempAppName, setTempAppName] = useState(appName);
  const [tempLogo, setTempLogo] = useState<string | null>(appLogo);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSaveGeneral = () => {
    setAppName(tempAppName);
    setAppLogo(tempLogo);
    // Afficher une notification de succès
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simuler le téléchargement d'un logo
      // Dans une application réelle, vous téléchargeriez le fichier sur un serveur
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setTempLogo(null);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Paramètres</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              className={`${
                activeTab === 'general'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 text-center border-b-2 font-medium text-sm flex-1 sm:flex-none sm:w-1/5`}
              onClick={() => setActiveTab('general')}
            >
              Général
            </button>
            <button
              className={`${
                activeTab === 'categories'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 text-center border-b-2 font-medium text-sm flex-1 sm:flex-none sm:w-1/5`}
              onClick={() => setActiveTab('categories')}
            >
              Catégories
            </button>
            <button
              className={`${
                activeTab === 'combat_rules'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 text-center border-b-2 font-medium text-sm flex-1 sm:flex-none sm:w-1/5`}
              onClick={() => setActiveTab('combat_rules')}
            >
              Règles de combat
            </button>
            <button
              className={`${
                activeTab === 'points'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 text-center border-b-2 font-medium text-sm flex-1 sm:flex-none sm:w-1/5`}
              onClick={() => setActiveTab('points')}
            >
              Points
            </button>
            <button
              className={`${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 text-center border-b-2 font-medium text-sm flex-1 sm:flex-none sm:w-1/5`}
              onClick={() => setActiveTab('users')}
            >
              Utilisateurs
            </button>
          </nav>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {activeTab === 'general' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Paramètres généraux</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="app-name" className="block text-sm font-medium text-gray-700">
                    Nom de l'application
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="app-name"
                      id="app-name"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={tempAppName}
                      onChange={(e) => setTempAppName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Logo de l'application
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                      {tempLogo ? (
                        <img src={tempLogo} alt="Logo" className="h-16 w-16 object-contain" />
                      ) : (
                        <span className="text-gray-400">Aucun logo</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <label htmlFor="logo-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <Upload className="h-4 w-4 mr-2" />
                        Télécharger
                        <input
                          id="logo-upload"
                          name="logo-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleLogoChange}
                        />
                      </label>
                      {tempLogo && (
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={handleRemoveLogo}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="competition-name" className="block text-sm font-medium text-gray-700">
                    Nom de la compétition
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="competition-name"
                      id="competition-name"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue="Tournoi International de Judo 2025"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="competition-date" className="block text-sm font-medium text-gray-700">
                    Date de la compétition
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="competition-date"
                      id="competition-date"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue="2025-06-15"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="competition-location" className="block text-sm font-medium text-gray-700">
                    Lieu de la compétition
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="competition-location"
                      id="competition-location"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue="Palais des Sports, Paris"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="competition-organizer" className="block text-sm font-medium text-gray-700">
                    Organisateur
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="competition-organizer"
                      id="competition-organizer"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue="Fédération Française de Judo"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="competition-contact" className="block text-sm font-medium text-gray-700">
                    Contact
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="competition-contact"
                      id="competition-contact"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue="contact@ffjudo.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="license-required" className="block text-sm font-medium text-gray-700">
                    Licence fédérale
                  </label>
                  <select
                    id="license-required"
                    name="license-required"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    defaultValue="required"
                  >
                    <option value="required">Obligatoire</option>
                    <option value="optional">Optionnelle</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleSaveGeneral}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Paramètres des catégories</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégories d'âge
                  </label>
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nom
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tranche d'âge
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Catégories de poids
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              defaultValue="Poussins"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-20 sm:text-sm border-gray-300 rounded-md"
                                defaultValue="8"
                              />
                              <span>-</span>
                              <input
                                type="number"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-20 sm:text-sm border-gray-300 rounded-md"
                                defaultValue="9"
                              />
                              <span>ans</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                                -20kg
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                                -22kg
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                                -24kg
                              </span>
                              <button className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <Plus className="h-3 w-3 mr-1" />
                                Ajouter
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-red-600 hover:text-red-900">
                              <Trash className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              defaultValue="Benjamins"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-20 sm:text-sm border-gray-300 rounded-md"
                                defaultValue="10"
                              />
                              <span>-</span>
                              <input
                                type="number"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-20 sm:text-sm border-gray-300 rounded-md"
                                defaultValue="11"
                              />
                              <span>ans</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                                -26kg
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                                -28kg
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                                -30kg
                              </span>
                              <button className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <Plus className="h-3 w-3 mr-1" />
                                Ajouter
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-red-600 hover:text-red-900">
                              <Trash className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une catégorie d'âge
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'combat_rules' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Règles de combat</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Durée du combat (secondes)
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="number"
                      name="duration"
                      id="duration"
                      className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                      defaultValue="240"
                    />
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      4:00
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="ipponPoints" className="block text-sm font-medium text-gray-700">
                      Points pour Ippon
                    </label>
                    <input
                      type="number"
                      name="ipponPoints"
                      id="ipponPoints"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      defaultValue="10"
                    />
                  </div>
                  <div>
                    <label htmlFor="wazaariPoints" className="block text-sm font-medium text-gray-700">
                      Points pour Waza-ari
                    </label>
                    <input
                      type="number"
                      name="wazaariPoints"
                      id="wazaariPoints"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      defaultValue="7"
                    />
                  </div>
                  <div>
                    <label htmlFor="yukoPoints" className="block text-sm font-medium text-gray-700">
                      Points pour Yuko
                    </label>
                    <input
                      type="number"
                      name="yukoPoints"
                      id="yukoPoints"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      defaultValue="1"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="maxPenalties" className="block text-sm font-medium text-gray-700">
                    Nombre maximum de pénalités avant disqualification
                  </label>
                  <input
                    type="number"
                    name="maxPenalties"
                    id="maxPenalties"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    defaultValue="3"
                  />
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="goldenScore"
                      name="goldenScore"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      defaultChecked
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="goldenScore" className="font-medium text-gray-700">
                      Activer le Golden Score
                    </label>
                    <p className="text-gray-500">En cas d'égalité à la fin du temps réglementaire</p>
                  </div>
                </div>

                <div>
                  <label htmlFor="goldenScoreDuration" className="block text-sm font-medium text-gray-700">
                    Durée du Golden Score (secondes)
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="number"
                      name="goldenScoreDuration"
                      id="goldenScoreDuration"
                      className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                      defaultValue="180"
                    />
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      3:00
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'points' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Paramètres des points</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points pour les médailles
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="gold-points" className="block text-sm font-medium text-gray-700">
                        Médaille d'or
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="number"
                          name="gold-points"
                          id="gold-points"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                          defaultValue="10"
                        />
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          points
                        </span>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="silver-points" className="block text-sm font-medium text-gray-700">
                        Médaille d'argent
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="number"
                          name="silver-points"
                          id="silver-points"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                          defaultValue="5"
                        />
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          points
                        </span>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="bronze-points" className="block text-sm font-medium text-gray-700">
                        Médaille de bronze
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="number"
                          name="bronze -points"
                          id="bronze-points"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                          defaultValue="2"
                        />
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          points
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points pour les bénévoles
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="volunteer-half-day" className="block text-sm font-medium text-gray-700">
                        Demi-journée
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="number"
                          name="volunteer-half-day"
                          id="volunteer-half-day"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                          defaultValue="5"
                        />
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          points
                        </span>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="volunteer-full-day" className="block text-sm font-medium text-gray-700">
                        Journée complète
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="number"
                          name="volunteer-full-day"
                          id="volunteer-full-day"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                          defaultValue="10"
                        />
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          points
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Gestion des utilisateurs</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-end mb-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un utilisateur
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-md overflow-hidden">
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
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">Jean Dupont</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">jean.dupont@example.com</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Administrateur
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-4">
                              Modifier
                            </a>
                            <a href="#" className="text-red-600 hover:text-red-900">
                              Supprimer
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">Marie Martin</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">marie.martin@example.com</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Arbitre
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-4">
                              Modifier
                            </a>
                            <a href="#" className="text-red-600 hover:text-red-900">
                              Supprimer
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;