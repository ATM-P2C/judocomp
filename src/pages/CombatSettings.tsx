import React, { useState } from 'react';
import { Save, Plus, Trash, AlertTriangle } from 'lucide-react';

const CombatSettings = () => {
  const [combatRules, setCombatRules] = useState({
    duration: 240, // en secondes
    ipponPoints: 10,
    wazaariPoints: 7,
    yukoPoints: 1,
    maxPenalties: 3,
    goldenScore: true,
    goldenScoreDuration: 180, // en secondes
  });

  const [ageCategories, setAgeCategories] = useState([
    { id: 1, name: 'Poussins', duration: 120, goldenScore: false },
    { id: 2, name: 'Benjamins', duration: 180, goldenScore: true },
    { id: 3, name: 'Minimes', duration: 240, goldenScore: true },
    { id: 4, name: 'Cadets', duration: 240, goldenScore: true },
    { id: 5, name: 'Juniors', duration: 300, goldenScore: true },
    { id: 6, name: 'Seniors', duration: 300, goldenScore: true },
  ]);

  const [tournamentSettings, setTournamentSettings] = useState({
    seedingMethod: 'belt', // 'belt', 'alphabetical', 'random'
    poolSize: 4,
    eliminationType: 'double', // 'single', 'double', 'repechage'
    thirdPlaceMatch: true,
    pointsForWin: 10,
    pointsForDraw: 5,
    pointsForLoss: 0,
  });

  const handleCombatRulesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setCombatRules({
      ...combatRules,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) : value
    });
  };

  const handleTournamentSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setTournamentSettings({
      ...tournamentSettings,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) : value
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Paramètres des combats</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <Save className="h-4 w-4 mr-2" />
          Enregistrer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Règles générales de combat */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Règles générales de combat</h2>
            
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
                    value={combatRules.duration}
                    onChange={handleCombatRulesChange}
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    {formatTime(combatRules.duration)}
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
                    value={combatRules.ipponPoints}
                    onChange={handleCombatRulesChange}
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
                    value={combatRules.wazaariPoints}
                    onChange={handleCombatRulesChange}
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
                    value={combatRules.yukoPoints}
                    onChange={handleCombatRulesChange}
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
                  value={combatRules.maxPenalties}
                  onChange={handleCombatRulesChange}
                />
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="goldenScore"
                    name="goldenScore"
                    type="checkbox"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    checked={combatRules.goldenScore}
                    onChange={handleCombatRulesChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="goldenScore" className="font-medium text-gray-700">
                    Activer le Golden Score
                  </label>
                  <p className="text-gray-500">En cas d'égalité à la fin du temps réglementaire</p>
                </div>
              </div>

              {combatRules.goldenScore && (
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
                      value={combatRules.goldenScoreDuration}
                      onChange={handleCombatRulesChange}
                    />
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      {formatTime(combatRules.goldenScoreDuration)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Paramètres du tournoi */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Paramètres du tournoi</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="seedingMethod" className="block text-sm font-medium text-gray-700">
                  Méthode de répartition des combattants
                </label>
                <select
                  id="seedingMethod"
                  name="seedingMethod"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={tournamentSettings.seedingMethod}
                  onChange={handleTournamentSettingsChange}
                >
                  <option value="belt">Par niveau de ceinture (les plus hauts se rencontrent en finale)</option>
                  <option value="alphabetical">Par ordre alphabétique</option>
                  <option value="random">Aléatoire</option>
                </select>
              </div>

              <div>
                <label htmlFor="poolSize" className="block text-sm font-medium text-gray-700">
                  Taille des poules
                </label>
                <select
                  id="poolSize"
                  name="poolSize"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={tournamentSettings.poolSize}
                  onChange={handleTournamentSettingsChange}
                >
                  <option value="3">3 combattants</option>
                  <option value="4">4 combattants</option>
                  <option value="5">5 combattants</option>
                  <option value="6">6 combattants</option>
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  Applicable uniquement pour les phases de poule
                </p>
              </div>

              <div>
                <label htmlFor="eliminationType" className="block text-sm font-medium text-gray-700">
                  Type d'élimination
                </label>
                <select
                  id="eliminationType"
                  name="eliminationType"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={tournamentSettings.eliminationType}
                  onChange={handleTournamentSettingsChange}
                >
                  <option value="single">Élimination directe</option>
                  <option value="double">Double repêchage</option>
                  <option value="repechage">Repêchage</option>
                </select>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="thirdPlaceMatch"
                    name="thirdPlaceMatch"
                    type="checkbox"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    checked={tournamentSettings.thirdPlaceMatch}
                    onChange={handleTournamentSettingsChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="thirdPlaceMatch" className="font-medium text-gray-700">
                    Match pour la 3ème place
                  </label>
                  <p className="text-gray-500">Organiser un match entre les perdants des demi-finales</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="pointsForWin" className="block text-sm font-medium text-gray-700">
                    Points pour victoire
                  </label>
                  <input
                    type="number"
                    name="pointsForWin"
                    id="pointsForWin"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={tournamentSettings.pointsForWin}
                    onChange={handleTournamentSettingsChange}
                  />
                </div>
                <div>
                  <label htmlFor="pointsForDraw" className="block text-sm font-medium text-gray-700">
                    Points pour match nul
                  </label>
                  <input
                    type="number"
                    name="pointsForDraw"
                    id="pointsForDraw"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={tournamentSettings.pointsForDraw}
                    onChange={handleTournamentSettingsChange}
                  />
                </div>
                <div>
                  <label htmlFor="pointsForLoss" className="block text-sm font-medium text-gray-700">
                    Points pour défaite
                  </label>
                  <input
                    type="number"
                    name="pointsForLoss"
                    id="pointsForLoss"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={tournamentSettings.pointsForLoss}
                    onChange={handleTournamentSettingsChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Paramètres par catégorie d'âge */}
      <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Paramètres par catégorie d'âge</h2>
            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une catégorie
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durée du combat
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Golden Score
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ageCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatTime(category.duration)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{category.goldenScore ? 'Activé' : 'Désactivé'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                        Modifier
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Attention</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                La modification des règles de combat peut affecter les compétitions en cours. 
                Il est recommandé de ne pas modifier ces paramètres pendant une compétition active.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombatSettings;