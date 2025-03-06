import React, { useState, useRef } from 'react';
import { X, Download, Upload, AlertCircle, Check } from 'lucide-react';
import Papa from 'papaparse';
import { Competitor } from '../hooks/useCompetitors';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (competitors: Partial<Competitor>[]) => Promise<{ success: number; errors: number }>;
  clubs: { id: string; name: string }[];
}

const ImportExportModal: React.FC<ImportExportModalProps> = ({ isOpen, onClose, onImport, clubs }) => {
  const [activeTab, setActiveTab] = useState<'import' | 'template'>('import');
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; errors: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Veuillez sélectionner un fichier CSV valide');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier CSV');
      return;
    }

    setImporting(true);
    setError(null);

    try {
      const text = await file.text();
      
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          if (results.errors.length > 0) {
            setError(`Erreur lors de l'analyse du CSV: ${results.errors[0].message}`);
            setImporting(false);
            return;
          }

          const competitors = results.data.map((row: any) => {
            // Trouver l'ID du club à partir du nom
            const club = clubs.find(c => c.name === row.club_name);
            
            return {
              first_name: row.first_name,
              last_name: row.last_name,
              club_id: club?.id || '',
              age_category: row.age_category,
              weight_category: row.weight_category,
              birth_date: row.birth_date,
              belt: row.belt,
              license_number: row.license_number,
              emergency_contact: row.emergency_contact,
              gender: row.gender,
              reference_number: row.reference_number || `JC-${Math.floor(100000 + Math.random() * 900000)}`
            };
          });

          // Vérifier les données
          const validCompetitors = competitors.filter((c: any) => 
            c.first_name && c.last_name && c.club_id && c.age_category && 
            c.weight_category && c.gender && c.birth_date
          );

          if (validCompetitors.length === 0) {
            setError('Aucun compétiteur valide trouvé dans le fichier CSV');
            setImporting(false);
            return;
          }

          try {
            const result = await onImport(validCompetitors);
            setImportResult(result);
          } catch (err: any) {
            setError(`Erreur lors de l'import: ${err.message || 'Erreur inconnue'}`);
          } finally {
            setImporting(false);
          }
        },
        error: (error) => {
          setError(`Erreur lors de l'analyse du CSV: ${error.message}`);
          setImporting(false);
        }
      });
    } catch (err: any) {
      setError(`Erreur lors de la lecture du fichier: ${err.message}`);
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'first_name',
      'last_name',
      'club_name',
      'age_category',
      'weight_category',
      'birth_date',
      'belt',
      'license_number',
      'emergency_contact',
      'gender'
    ];

    const sampleData = [
      {
        first_name: 'Jean',
        last_name: 'Dupont',
        club_name: 'Judo Club Paris',
        age_category: 'Minimes',
        weight_category: '-46kg',
        birth_date: '2010-05-15',
        belt: 'Orange',
        license_number: 'FJ123456',
        emergency_contact: '0612345678',
        gender: 'male'
      },
      {
        first_name: 'Marie',
        last_name: 'Martin',
        club_name: 'Judo Club Lyon',
        age_category: 'Benjamins',
        weight_category: '-40kg',
        birth_date: '2012-08-22',
        belt: 'Jaune/Orange',
        license_number: 'FJ234567',
        emergency_contact: '0623456789',
        gender: 'female'
      }
    ];

    const csv = Papa.unparse({
      fields: headers,
      data: sampleData
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'modele_import_competiteurs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Import de compétiteurs</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === 'import'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('import')}
            >
              Importer des compétiteurs
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === 'template'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('template')}
            >
              Modèle CSV
            </button>
          </div>

          {activeTab === 'import' && (
            <div>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Importez vos compétiteurs à partir d'un fichier CSV. Assurez-vous que votre fichier suit le format du modèle.
                </p>

                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Cliquez pour sélectionner</span> ou glissez-déposez
                      </p>
                      <p className="text-xs text-gray-500">CSV uniquement</p>
                      {file && (
                        <div className="mt-4 text-sm text-indigo-600 font-medium">
                          Fichier sélectionné: {file.name}
                        </div>
                      )}
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      accept=".csv"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {importResult && (
                  <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span>
                      Import terminé: {importResult.success} compétiteurs importés avec succès
                      {importResult.errors > 0 ? `, ${importResult.errors} erreurs` : ''}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleImport}
                  disabled={!file || importing}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {importing ? 'Importation en cours...' : 'Importer'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'template' && (
            <div>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Téléchargez notre modèle CSV pour vous assurer que votre fichier d'import est correctement formaté.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Structure du fichier CSV</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Votre fichier CSV doit contenir les colonnes suivantes:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-gray-600 mb-4 space-y-1">
                    <li><span className="font-medium">first_name</span>: Prénom du compétiteur</li>
                    <li><span className="font-medium">last_name</span>: Nom du compétiteur</li>
                    <li><span className="font-medium">club_name</span>: Nom du club (doit exister dans la base de données)</li>
                    <li><span className="font-medium">age_category</span>: Catégorie d'âge (ex: Minimes, Benjamins, etc.)</li>
                    <li><span className="font-medium">weight_category</span>: Catégorie de poids (ex: -46kg, -73kg, etc.)</li>
                    <li><span className="font-medium">birth_date</span>: Date de naissance (format YYYY-MM-DD)</li>
                    <li><span className="font-medium">belt</span>: Ceinture (ex: Blanche, Jaune, Orange, etc.)</li>
                    <li><span className="font-medium">license_number</span>: Numéro de licence</li>
                    <li><span className="font-medium">emergency_contact</span>: Contact d'urgence</li>
                    <li><span className="font-medium">gender</span>: Genre (male ou female)</li>
                  </ul>

                  <div className="bg-white p-3 rounded border border-gray-300 overflow-x-auto">
                    <code className="text-xs text-gray-800">
                      first_name,last_name,club_name,age_category,weight_category,birth_date,belt,license_number,emergency_contact,gender<br/>
                      Jean,Dupont,Judo Club Paris,Minimes,-46kg,2010-05-15,Orange,FJ123456,0612345678,male<br/>
                      Marie,Martin,Judo Club Lyon,Benjamins,-40kg,2012-08-22,Jaune/Orange,FJ234567,0623456789,female
                    </code>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={downloadTemplate}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le modèle CSV
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;