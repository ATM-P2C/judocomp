import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle, Check } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';

const CategoryForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { getCategoryById, addCategory, updateCategory } = useCategories();
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    age_category: '',
    weight_category: '',
    gender: 'male',
    tournament_id: null as string | null
  });

  // Options pour les catégories d'âge
  const ageCategories = [
    'Poussins',
    'Benjamins',
    'Minimes',
    'Cadets',
    'Juniors',
    'Seniors',
    'Vétérans'
  ];

  // Options pour les catégories de poids par catégorie d'âge
  const weightCategoriesByAge = {
    'Poussins': ['-20kg', '-22kg', '-24kg', '-26kg', '-28kg', '-30kg', '-32kg', '-34kg', '-36kg', '-38kg', '-40kg', '+40kg'],
    'Benjamins': ['-26kg', '-28kg', '-30kg', '-32kg', '-34kg', '-36kg', '-38kg', '-40kg', '-42kg', '-44kg', '-46kg', '-48kg', '-50kg', '+50kg'],
    'Minimes': ['-34kg', '-38kg', '-42kg', '-46kg', '-50kg', '-55kg', '-60kg', '-66kg', '+66kg'],
    'Cadets': ['-46kg', '-50kg', '-55kg', '-60kg', '-66kg', '-73kg', '-81kg', '-90kg', '+90kg'],
    'Juniors': ['-55kg', '-60kg', '-66kg', '-73kg', '-81kg', '-90kg', '-100kg', '+100kg'],
    'Seniors': ['-60kg', '-66kg', '-73kg', '-81kg', '-90kg', '-100kg', '+100kg'],
    'Vétérans': ['-60kg', '-66kg', '-73kg', '-81kg', '-90kg', '-100kg', '+100kg']
  };

  // Mock data pour les tournois
  const tournaments = [
    { id: '1', name: 'Championnat Régional de Judo 2025' },
    { id: '2', name: 'Tournoi International Junior 2025' },
    { id: '3', name: 'Coupe de France Cadets 2025' }
  ];

  useEffect(() => {
    const fetchCategory = async () => {
      if (isEditMode && id) {
        try {
          const { data, error } = await getCategoryById(id);
          if (error) {
            throw error;
          }
          if (data) {
            setFormData({
              name: data.name,
              age_category: data.age_category,
              weight_category: data.weight_category,
              gender: data.gender,
              tournament_id: data.tournament_id
            });
          }
        } catch (err) {
          console.error('Error fetching category:', err);
          setError('Erreur lors du chargement des données de la catégorie');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCategory();
  }, [id, isEditMode, getCategoryById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Réinitialiser la catégorie de poids si la catégorie d'âge change
    if (name === 'age_category') {
      setFormData({
        ...formData,
        age_category: value,
        weight_category: ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    try {
      // Générer un nom complet pour la catégorie si non spécifié
      const categoryName = formData.name || `${formData.age_category} ${formData.weight_category} ${formData.gender === 'male' ? 'Masculin' : 'Féminin'}`;
      
      const categoryData = {
        ...formData,
        name: categoryName
      };
      
      if (isEditMode && id) {
        const { error } = await updateCategory(id, categoryData);
        if (error) {
          throw error;
        }
        setSuccess(true);
        setTimeout(() => {
          navigate('/settings');
        }, 1500);
      } else {
        const { error } = await addCategory(categoryData);
        if (error) {
          throw error;
        }
        setSuccess(true);
        setTimeout(() => {
          navigate('/settings');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error saving category:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement de la catégorie');
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
            onClick={() => navigate('/settings')}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour aux paramètres
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEditMode ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
          </h1>
        </div>
        <div>
          <button
            type="submit"
            form="category-form"
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
                Catégorie {isEditMode ? 'modifiée' : 'ajoutée'} avec succès
              </span>
            </div>
          )}

          <form id="category-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom de la catégorie (optionnel)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Laissez vide pour générer automatiquement"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Si laissé vide, le nom sera généré automatiquement à partir des autres champs.
                </p>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="age_category" className="block text-sm font-medium text-gray-700">
                  Catégorie d'âge
                </label>
                <div className="mt-1">
                  <select
                    id="age_category"
                    name="age_category"
                    value={formData.age_category}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {ageCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="weight_category" className="block text-sm font-medium text-gray-700">
                  Catégorie de poids
                </label>
                <div className="mt-1">
                  <select
                    id="weight_category"
                    name="weight_category"
                    value={formData.weight_category}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                    disabled={!formData.age_category}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {formData.age_category && weightCategoriesByAge[formData.age_category as keyof typeof weightCategoriesByAge]?.map(weight => (
                      <option key={weight} value={weight}>{weight}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Genre
                </label>
                <div className="mt-1">
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  >
                    <option value="male">Masculin</option>
                    <option value="female">Féminin</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="tournament_id" className="block text-sm font-medium text-gray-700">
                  Tournoi
                </label>
                <div className="mt-1">
                  <select
                    id="tournament_id"
                    name="tournament_id"
                    value={formData.tournament_id || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Sélectionner un tournoi (optionnel)</option>
                    {tournaments.map(tournament => (
                      <option key={tournament.id} value={tournament.id}>{tournament.name}</option>
                    ))}
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

export default CategoryForm;