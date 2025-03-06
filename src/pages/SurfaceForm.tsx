import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle, Check } from 'lucide-react';

interface Surface {
  id: string;
  name: string;
  status: string;
  table_chief_id: string | null;
  referee_id: string | null;
}

const SurfaceForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    status: 'inactive',
    table_chief_id: '',
    referee_id: ''
  });

  // Mock data pour le personnel
  const staff = [
    { id: '1', name: 'Jean Dupont', role: 'Table Chief' },
    { id: '2', name: 'Marie Martin', role: 'Referee' },
    { id: '3', name: 'Pierre Dubois', role: 'Table Chief' },
    { id: '4', name: 'Sophie Leroy', role: 'Referee' },
    { id: '5', name: 'Thomas Moreau', role: 'Table Chief' },
    { id: '6', name: 'Julie Petit', role: 'Referee' }
  ];

  // Mock function pour récupérer les données d'une surface
  const fetchSurface = async (id: string) => {
    // Simuler un appel API
    return new Promise<{ data: Surface | null, error: any }>((resolve) => {
      setTimeout(() => {
        const mockSurface = {
          id: '1',
          name: 'Tatami 1',
          status: 'active',
          table_chief_id: '1',
          referee_id: '2'
        };
        
        resolve({ data: mockSurface, error: null });
      }, 500);
    });
  };

  // Mock function pour ajouter une surface
  const addSurface = async (surface: Omit<Surface, 'id'>) => {
    // Simuler un appel API
    return new Promise<{ data: Surface | null, error: any }>((resolve) => {
      setTimeout(() => {
        resolve({ data: { id: '123', ...surface }, error: null });
      }, 500);
    });
  };

  // Mock function pour mettre à jour une surface
  const updateSurface = async (id: string, updates: Partial<Surface>) => {
    // Simuler un appel API
    return new Promise<{ data: Surface | null, error: any }>((resolve) => {
      setTimeout(() => {
        resolve({ data: { id, ...updates } as Surface, error: null });
      }, 500);
    });
  };

  useEffect(() => {
    const getSurface = async () => {
      if (isEditMode && id) {
        try {
          const { data, error } = await fetchSurface(id);
          if (error) {
            throw error;
          }
          if (data) {
            setFormData({
              name: data.name,
              status: data.status,
              table_chief_id: data.table_chief_id || '',
              referee_id: data.referee_id || ''
            });
          }
        } catch (err) {
          console.error('Error fetching surface:', err);
          setError('Erreur lors du chargement des données de la surface');
        } finally {
          setLoading(false);
        }
      }
    };

    getSurface();
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    try {
      if (isEditMode && id) {
        const { error } = await updateSurface(id, formData);
        if (error) {
          throw error;
        }
        setSuccess(true);
        setTimeout(() => {
          navigate('/surfaces');
        }, 1500);
      } else {
        const { error } = await addSurface(formData);
        if (error) {
          throw error;
        }
        setSuccess(true);
        setTimeout(() => {
          navigate('/surfaces');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error saving surface:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement de la surface');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button 
            onClick={() => navigate('/surfaces')}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour aux surfaces
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEditMode ? 'Modifier la surface' : 'Ajouter une surface'}
          </h1>
        </div>
        <div>
          <button
            type="submit"
            form="surface-form"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 rounded-md flex items-start">
              <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
              <span className="text-green-700">
                Surface {isEditMode ? 'modifiée' : 'ajoutée'} avec succès
              </span>
            </div>
          )}

          <form id="surface-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom de la surface
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Statut
                </label>
                <div className="mt-1">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="paused">En pause</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="table_chief_id" className="block text-sm font-medium text-gray-700">
                  Chef de table
                </label>
                <div className="mt-1">
                  <select
                    id="table_chief_id"
                    name="table_chief_id"
                    value={formData.table_chief_id}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Sélectionner un chef de table</option>
                    {staff
                      .filter(s => s.role === 'Table Chief')
                      .map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="referee_id" className="block text-sm font-medium text-gray-700">
                  Arbitre
                </label>
                <div className="mt-1">
                  <select
                    id="referee_id"
                    name="referee_id"
                    value={formData.referee_id}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Sélectionner un arbitre</option>
                    {staff
                      .filter(s => s.role === 'Referee')
                      .map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SurfaceForm;