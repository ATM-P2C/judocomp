import React, { useState } from 'react';
import { Plus, Edit, Trash, Users, Clock } from 'lucide-react';

const SurfaceManagement = () => {
  const [showAddSurfaceForm, setShowAddSurfaceForm] = useState(false);
  const [editingSurfaceId, setEditingSurfaceId] = useState<number | null>(null);
  
  // Mock data for demonstration
  const [surfaces, setSurfaces] = useState([
    { 
      id: 1, 
      name: 'Tatami 1', 
      status: 'active',
      tableChief: { id: 1, name: 'Jean Dupont' },
      referee: { id: 2, name: 'Marie Martin' },
      currentMatch: { id: 101, category: 'Minimes -46kg', competitor1: 'Lucas Martin', competitor2: 'Thomas Dubois', startTime: '10:15' },
      nextMatches: [
        { id: 105, category: 'Minimes -46kg', competitor1: 'Alexandre Petit', competitor2: 'Nicolas Leroy', scheduledTime: '10:30' },
        { id: 109, category: 'Cadets -60kg', competitor1: 'Maxime Dupont', competitor2: 'Antoine Moreau', scheduledTime: '10:45' },
      ]
    },
    { 
      id: 2, 
      name: 'Tatami 2', 
      status: 'active',
      tableChief: { id: 3, name: 'Pierre Dubois' },
      referee: { id: 4, name: 'Sophie Leroy' },
      currentMatch: { id: 102, category: 'Cadets -60kg', competitor1: 'Julien Bernard', competitor2: 'Romain Fournier', startTime: '10:10' },
      nextMatches: [
        { id: 106, category: 'Juniors -73kg', competitor1: 'Théo Guerin', competitor2: 'Paul Faure', scheduledTime: '10:25' },
        { id: 110, category: 'Seniors -66kg', competitor1: 'David Roux', competitor2: 'Pierre Gaillard', scheduledTime: '10:40' },
      ]
    },
    { 
      id: 3, 
      name: 'Tatami 3', 
      status: 'inactive',
      tableChief: { id: 5, name: 'Thomas Moreau' },
      referee: { id: 6, name: 'Julie Petit' },
      currentMatch: null,
      nextMatches: [
        { id: 107, category: 'Benjamins -38kg', competitor1: 'Léo Girard', competitor2: 'Hugo Blanc', scheduledTime: '11:00' },
        { id: 111, category: 'Minimes -42kg', competitor1: 'Nathan Rousseau', competitor2: 'Mathis Lambert', scheduledTime: '11:15' },
      ]
    },
    { 
      id: 4, 
      name: 'Tatami 4', 
      status: 'paused',
      tableChief: { id: 7, name: 'Nicolas Bernard' },
      referee: { id: 8, name: 'Camille Fournier' },
      currentMatch: null,
      nextMatches: [
        { id: 108, category: 'Cadets -55kg', competitor1: 'Enzo Mercier', competitor2: 'Louis Bonnet', scheduledTime: '10:50' },
        { id: 112, category: 'Juniors -81kg', competitor1: 'Quentin Mercier', competitor2: 'Julien Roux', scheduledTime: '11:05' },
      ]
    },
  ]);

  const [newSurface, setNewSurface] = useState({
    name: '',
    tableChief: '',
    referee: '',
  });

  // Mock data for staff selection
  const availableStaff = [
    { id: 1, name: 'Jean Dupont', role: 'Table Chief' },
    { id: 2, name: 'Marie Martin', role: 'Referee' },
    { id: 3, name: 'Pierre Dubois', role: 'Table Chief' },
    { id: 4, name: 'Sophie Leroy', role: 'Referee' },
    { id: 5, name: 'Thomas Moreau', role: 'Table Chief' },
    { id: 6, name: 'Julie Petit', role: 'Referee' },
    { id: 7, name: 'Nicolas Bernard', role: 'Table Chief' },
    { id: 8, name: 'Camille Fournier', role: 'Referee' },
    { id: 9, name: 'Éric Lambert', role: 'Table Chief' },
    { id: 10, name: 'Aurélie Rousseau', role: 'Referee' },
  ];

  const handleAddSurface = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Dans une application réelle, vous enverriez ces données à l'API
    const newId = Math.max(...surfaces.map(s => s.id)) + 1;
    
    const tableChiefObj = availableStaff.find(s => s.name === newSurface.tableChief);
    const refereeObj = availableStaff.find(s => s.name === newSurface.referee);
    
    setSurfaces([
      ...surfaces,
      {
        id: newId,
        name: newSurface.name,
        status: 'inactive',
        tableChief: tableChiefObj ? { id: tableChiefObj.id, name: tableChiefObj.name } : { id: 0, name: newSurface.tableChief },
        referee: refereeObj ? { id: refereeObj.id, name: refereeObj.name } : { id: 0, name: newSurface.referee },
        currentMatch: null,
        nextMatches: []
      }
    ]);
    
    // Réinitialiser le formulaire
    setNewSurface({
      name: '',
      tableChief: '',
      referee: '',
    });
    setShowAddSurfaceForm(false);
  };

  const handleEditSurface = (surfaceId: number) => {
    const surface = surfaces.find(s => s.id === surfaceId);
    if (surface) {
      setNewSurface({
        name: surface.name,
        tableChief: surface.tableChief.name,
        referee: surface.referee.name,
      });
      setEditingSurfaceId(surfaceId);
      setShowAddSurfaceForm(true);
    }
  };

  const handleUpdateSurface = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSurfaceId) {
      const tableChiefObj = availableStaff.find(s => s.name === newSurface.tableChief);
      const refereeObj = availableStaff.find(s => s.name === newSurface.referee);
      
      setSurfaces(surfaces.map(surface => 
        surface.id === editingSurfaceId
          ? {
              ...surface,
              name: newSurface.name,
              tableChief: tableChiefObj ? { id: tableChiefObj.id, name: tableChiefObj.name } : { id: 0, name: newSurface.tableChief },
              referee: refereeObj ? { id: refereeObj.id, name: refereeObj.name } : { id: 0, name: newSurface.referee },
            }
          : surface
      ));
      
      // Réinitialiser le formulaire
      setNewSurface({
        name: '',
        tableChief: '',
        referee: '',
      });
      setEditingSurfaceId(null);
      setShowAddSurfaceForm(false);
    }
  };

  const handleDeleteSurface = (surfaceId: number) => {
    // Dans une application réelle, vous enverriez une demande de suppression à l'API
    setSurfaces(surfaces.filter(surface => surface.id !== surfaceId));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Actif</span>;
      case 'inactive':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Inactif</span>;
      case 'paused':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">En pause</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestion des surfaces de combat</h1>
        <button 
          onClick={() => {
            setEditingSurfaceId(null);
            setNewSurface({
              name: '',
              tableChief: '',
              referee: '',
            });
            setShowAddSurfaceForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une surface
        </button>
      </div>

      {showAddSurfaceForm && (
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingSurfaceId ? 'Modifier la surface' : 'Ajouter une nouvelle surface'}
            </h2>
            
            <form onSubmit={editingSurfaceId ? handleUpdateSurface : handleAddSurface}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="surface-name" className="block text-sm font-medium text-gray-700">
                    Nom de la surface
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="surface-name"
                      id="surface-name"
                      value={newSurface.name}
                      onChange={(e) => setNewSurface({...newSurface, name: e.target.value})}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="table-chief" className="block text-sm font-medium text-gray-700">
                    Chef de table
                  </label>
                  <div className="mt-1">
                    <select
                      id="table-chief"
                      name="table-chief"
                      value={newSurface.tableChief}
                      onChange={(e) => setNewSurface({...newSurface, tableChief: e.target.value})}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Sélectionner un chef de table</option>
                      {availableStaff
                        .filter(staff => staff.role === 'Table Chief')
                        .map(staff => (
                          <option key={staff.id} value={staff.name}>{staff.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="referee" className="block text-sm font-medium text-gray-700">
                    Arbitre
                  </label>
                  <div className="mt-1">
                    <select
                      id="referee"
                      name="referee"
                      value={newSurface.referee}
                      onChange={(e) => setNewSurface({...newSurface, referee: e.target.value})}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Sélectionner un arbitre</option>
                      {availableStaff
                        .filter(staff => staff.role === 'Referee')
                        .map(staff => (
                          <option key={staff.id} value={staff.name}>{staff.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {editingSurfaceId ? 'Mettre à jour' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddSurfaceForm(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {surfaces.map((surface) => (
          <div key={surface.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  {surface.name}
                  <span className="ml-2">{getStatusBadge(surface.status)}</span>
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Chef de table: {surface.tableChief.name} | Arbitre: {surface.referee.name}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditSurface(surface.id)}
                  className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteSurface(surface.id)}
                  className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-md font-medium text-gray-700 mb-3">Combat en cours</h4>
                {surface.currentMatch ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-yellow-800">{surface.currentMatch.category}</span>
                      <span className="text-xs font-medium text-gray-500">Débuté à {surface.currentMatch.startTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{surface.currentMatch.competitor1} vs {surface.currentMatch.competitor2}</span>
                      <a href={`/match/${surface.currentMatch.id}`} className="text-xs text-indigo-600 hover:text-indigo-900">
                        Voir le combat
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-3 bg-gray-50 rounded-md mb-4">
                    <p className="text-sm text-gray-500">Aucun combat en cours</p>
                  </div>
                )}

                <h4 className="text-md font-medium text-gray-700 mb-3">Prochains combats</h4>
                {surface.nextMatches.length > 0 ? (
                  <div className="space-y-3">
                    {surface.nextMatches.map((match) => (
                      <div key={match.id} className="border border-gray-200 rounded-md p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-gray-800">{match.category}</span>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {match.scheduledTime}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{match.competitor1} vs {match.competitor2}</span>
                          <a href={`/match/${match.id}`} className="text-xs text-indigo-600 hover:text-indigo-900">
                            Démarrer
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Aucun combat programmé</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurfaceManagement;