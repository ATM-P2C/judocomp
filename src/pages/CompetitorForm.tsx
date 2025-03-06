import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle, Check } from 'lucide-react';
import { useCompetitors } from '../hooks/useCompetitors';
import { useClubs } from '../hooks/useClubs';

const CompetitorForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { getCompetitorById, addCompetitor, updateCompetitor } = useCompetitors();
  const { clubs, loading: loadingClubs } = useClubs();
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    club_id: '',
    age_category: '',
    weight_category: '',
    birth_date: '',
    belt: '',
    license_number: '',
    emergency_contact: '',
    gender: 'male',
    reference_number: `JC-${Math.floor(100000 + Math.random() * 900000)}`
  });

  // Catégories d'âge et de poids prédéfinies
  const ageCategories = [
    'Poussins',
    'Benjamins',
    'Minimes',
    'Cadets',
    'Juniors',
    'Seniors',
    'Vétérans'
  ];

  const weightCategories = {
    'Poussins': ['-20kg', '-22kg', '-24kg', '-26kg', '-28kg', '-30kg', '-32kg', '-34kg', '-36kg', '-38kg', '-40kg', '+40kg'],
    'Benjamins': ['-26kg', '-28kg', '-30kg', '-32kg', '-34kg', '-36kg', '-38kg', '-40kg', '-42kg', '-44kg', '-46kg', '-48kg', '-50kg', '+50kg'],
    'Minimes': ['-34kg', '-38kg', '-42kg', '-46kg', '-50kg', '-55kg', '-60kg', '-66kg', '+66kg'],
    'Cadets': ['-46kg', '-50kg', '-55kg', '-60kg', '-66kg', '-73kg', '-81kg', '-90kg', '+90kg'],
    'Juniors': ['-55kg', '-60kg', '-66kg', '-73kg', '-81kg', '-90kg', '-100kg', '+100kg'],
    'Seniors': ['-60kg', '-66kg', '-73kg', '-81kg', '-90kg', '-100kg', '+100kg'],
    'Vétérans': ['-60kg', '-66kg', '-73kg', '-81kg', '-90kg', '-100kg', '+100kg']
  };

  const belts = [
    'Blanche',
    'Blanche/Jaune',
    'Jaune',
    'Jaune/Orange',
    'Orange',
    'Orange/Verte',
    'Verte',
    'Verte/Bleue',
    'Bleue',
    'Bleue/Marron',
    'Marron',
    'Noire'
  ];

  useEffect(() => {
    const fetchCompetitor = async () => {
      if (isEditMode && id) {
        try {
          const { data, error } = await getCompetitorById(id);
          if (error) {
            throw error;
          }
          if (data) {
            setFormData({
              first_name: data.first_name,
              last_name: data.last_name,
              club_id: data.club_id,
              age_category: data.age_category,
              weight_category: data.weight_category,
              birth_date: data.birth_date ? data.birth_date.substring(0, 10) : '',
              belt: data.belt,
              license_number: data.license_number,
              emergency_contact: data.emergency_contact,
              gender: data.gender,
              reference_number: data.reference_number || formData.reference_number
            });
          }
        } catch (err) {
          console.error('Error fetching competitor:', err);
          setError('Erreur lors du chargement des données du compétiteur');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCompetitor();
  }, [id, isEditMode, getCompetitorById]);

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
      if (isEditMode && id) {
        const { error } = await updateCompetitor(id, formData);
        if (error) {
          throw error;
        }
        setSuccess(true);
        setTimeout(() => {
          navigate('/competitors');
        }, 1500);
      } else {
        const { error } = await addCompetitor(formData);
        if (error) {
          throw error;
        }
        setSuccess(true);
        setTimeout(() => {
          navigate('/competitors');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error saving competitor:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement du compétiteur');
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
            onClick={() => navigate('/competitors')}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour aux compétiteurs
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEditMode ? 'Modifier le compétiteur' : 'Ajouter un compétiteur'}
          </h1>
        </div>
        <div>
          <button
            type="submit"
            form="competitor-form"
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
                Compétiteur {isEditMode ? 'modifié' : 'ajouté'} avec succès
              </span>
            </div>
          )}

          <form id="competitor-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  Prénom
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="club_id" className="block text-sm font-medium text-gray-700">
                  Club
                </label>
                <div className="mt-1">
                  <select
                    id="club_id"
                    name="club_id"
                    value={formData.club_id}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Sélectionner un club</option>
                    {clubs.map(club => (
                      <option key={club.id} value={club.id}>{club.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
                  Date de naissance
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="birth_date"
                    id="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
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
                <label htmlFor="license_number" className="block text-sm font-medium text-gray-700">
                  Numéro de licence
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="license_number"
                    id="license_number"
                    value={formData.license_number}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
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
                    {formData.age_category && weightCategories[formData.age_category as keyof typeof weightCategories]?.map(weight => (
                      <option key={weight} value={weight}>{weight}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="belt" className="block text-sm font-medium text-gray-700">
                  Ceinture
                </label>
                <div className="mt-1">
                  <select
                    id="belt"
                    name="belt"
                    value={formData.belt}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Sélectionner une ceinture</option>
                    {belts.map(belt => (
                      <option key={belt} value={belt}>{belt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-700">
                  Contact d'urgence
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="emergency_contact"
                    id="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="reference_number" className="block text-sm font-medium text-gray-700">
                  Numéro de référence
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="reference_number"
                    id="reference_number"
                    value={formData.reference_number}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Ce numéro est généré automatiquement et utilisé pour le QR code.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompetitorForm;