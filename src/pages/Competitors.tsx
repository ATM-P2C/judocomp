import React, { useState, useEffect } from 'react';
import { Plus, Upload, Download, Search, Filter, Edit, Trash, QrCode, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCompetitors, Competitor } from '../hooks/useCompetitors';
import { useClubs } from '../hooks/useClubs';
import ImportExportModal from '../components/ImportExportModal';
import QRCodeGenerator from '../components/QRCodeGenerator';
import Papa from 'papaparse';

const Competitors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showQRCode, setShowQRCode] = useState<string | null>(null);
  const { competitors, loading, error, fetchCompetitors, addCompetitor, deleteCompetitor } = useCompetitors();
  const { clubs, loading: loadingClubs } = useClubs();
  
  const filteredCompetitors = competitors.filter(competitor => 
    competitor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    competitor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (competitor.club?.name && competitor.club.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    competitor.license_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImportCompetitors = async (newCompetitors: Partial<Competitor>[]) => {
    let successCount = 0;
    let errorCount = 0;

    for (const competitor of newCompetitors) {
      try {
        const { error } = await addCompetitor(competitor as Omit<Competitor, 'id' | 'created_at' | 'updated_at' | 'club'>);
        if (error) {
          console.error('Error adding competitor:', error);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (err) {
        console.error('Error in import process:', err);
        errorCount++;
      }
    }

    // Refresh the competitors list
    await fetchCompetitors();

    return { success: successCount, errors: errorCount };
  };

  const handleExportCompetitors = () => {
    // Préparer les données pour l'export
    const exportData = competitors.map(competitor => ({
      first_name: competitor.first_name,
      last_name: competitor.last_name,
      club_name: competitor.club?.name || '',
      age_category: competitor.age_category,
      weight_category: competitor.weight_category,
      birth_date: competitor.birth_date || '',
      belt: competitor.belt,
      license_number: competitor.license_number,
      emergency_contact: competitor.emergency_contact,
      gender: competitor.gender,
      reference_number: competitor.reference_number || ''
    }));

    // Convertir en CSV
    const csv = Papa.unparse(exportData);
    
    // Créer un blob et télécharger
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'competiteurs_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteCompetitor = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce compétiteur ?')) {
      await deleteCompetitor(id);
    }
  };

  const toggleQRCode = (id: string | null) => {
    setShowQRCode(id === showQRCode ? null : id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestion des compétiteurs</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </button>
          <button 
            onClick={handleExportCompetitors}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
          <Link 
            to="/competitor/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un compétiteur
          </Link>
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
                placeholder="Rechercher un compétiteur..."
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

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Chargement des compétiteurs...</div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md">
              <div className="text-red-700">{error}</div>
            </div>
          ) : (
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
                      Catégorie
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date de naissance
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ceinture
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Licence
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Contact d'urgence
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCompetitors.map((competitor) => (
                    <React.Fragment key={competitor.id}>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {competitor.last_name} {competitor.first_name}
                              </div>
                              {competitor.reference_number && (
                                <div className="text-xs text-gray-500">
                                  Réf: {competitor.reference_number}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{competitor.club?.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{competitor.age_category} {competitor.weight_category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {competitor.birth_date ? new Date(competitor.birth_date).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {competitor.belt}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {competitor.license_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {competitor.emergency_contact}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2 justify-end">
                            <button 
                              onClick={() => toggleQRCode(competitor.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Afficher QR Code"
                            >
                              <QrCode className="h-4 w-4" />
                            </button>
                            <Link 
                              to={`/badge/competitor/${competitor.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Imprimer badge"
                            >
                              <Printer className="h-4 w-4" />
                            </Link>
                            <Link 
                              to={`/competitor/edit/${competitor.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDeleteCompetitor(competitor.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {showQRCode === competitor.id && (
                        <tr className="bg-gray-50">
                          <td colSpan={8} className="px-6 py-4">
                            <div className="flex items-center justify-center">
                              <div className="text-center">
                                <QRCodeGenerator 
                                  value={competitor.reference_number || competitor.id} 
                                  size={150}
                                  className="mx-auto mb-2"
                                />
                                <p className="text-sm text-gray-600">
                                  {competitor.reference_number || competitor.id}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {competitor.last_name} {competitor.first_name} - {competitor.age_category} {competitor.weight_category}
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
          )}
        </div>
      </div>

      {/* Modal d'import */}
      {showImportModal && (
        <ImportExportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleImportCompetitors}
          clubs={clubs.map(club => ({ id: club.id, name: club.name }))}
        />
      )}
    </div>
  );
};

export default Competitors;