import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle, Check } from 'lucide-react';
import { useTournaments } from '../hooks/useTournaments';

const TournamentForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { getTournamentById, addTournament, updateTournament } = useTournaments();
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    organizer: '',
    contact_email: '',
    status: 'draft',
    combat_rules_id: '',
    // Tournament settings
    seeding_method: 'belt',
    pool_size: 4,
    elimination_type: 'double',
    third_place_match: true,
    points_for_win: 10,
    points_for_draw: 5,
    points_for_loss: 0,
    // Multi-day tournament
    end_date: new Date().toISOString().split('T')[0],
    is_multi_day: false
  });

  // Mock data for combat rules
  const combatRules = [
    { id: '1', name: 'Standard Rules' },
    { id: '2', name: 'Youth Rules' },
    { id: '3', name: 'Children Rules' }
  ];

  useEffect(() => {
    const fetchTournament = async () => {
      if (isEditMode && id) {
        try {
          const { data, error } = await getTournamentById(id);
          if (error) {
            throw error;
          }
          if (data) {
            // Dans une application réelle, vous récupéreriez également les paramètres du tournoi
            setFormData({
              name: data.name,
              date: data.date,
              location: data.location,
              organizer: data.organizer,
              contact_email: data.contact_email,
              status: data.status,
              combat_rules_id: data.combat_rules_id || '',
              // Valeurs par défaut pour les paramètres du tournoi
              seeding_method: 'belt',
              pool_size: 4,
              elimination_type: 'double',
              third_place_match: true,
              points_for_win: 10,
              points_for_draw: 5,
              points_for_loss: 0,
              // Multi-day tournament
              end_date: data.end_date || data.date,
              is_multi_day: data.end_date ? true : false
            });
          }
        } catch (err) {
          console.error('Error fetching tournament:', err);
          setError('Erreur lors du chargement des données du tournoi');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTournament();
  }, [id, isEditMode, getTournamentById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? parseInt(value) 
          : value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    try {
      if (isEditMode && id) {
        const { error } = await updateTournament(id, {
          name: formData.name,
          date: formData.date,
          location: formData.location,
          organizer: formData.organizer,
          contact_email: formData.contact_email,
          status: formData.status,
          combat_rules_id: formData.combat_rules_id || null,
          end_date: formData.is_multi_day ? formData.end_date : null
        });
        
        if (error) {
          throw error;
        }
        
        setSuccess(true);
        setTimeout(() => {
          navigate('/tournaments');
        }, 1500);
      } else {
        const { error } = await addTournament(
          {
            name: formData.name,
            date: formData.date,
            location: formData.location,
            organizer: formData.organizer,
            contact_email: formData.contact_email,
            status: formData.status,
            combat_rules_id: formData.combat_rules_id || null,
            end_date: formData.is_multi_day ? formData.end_date : null
          },
          {
            seeding_method: formData.seeding_method,
            pool_size: formData.pool_size,
            elimination_type: formData.elimination_type,
            third_place_match: formData.third_place_match,
            points_for_win: formData.points_for_win,
            points_for_draw: formData.points_for_draw,
            points_for_loss: formData.points_for_loss
          }
        );
        
        if (error) {
          throw error;
        }
        
        setSuccess(true);
        setTimeout(() => {
          navigate('/tournaments');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error saving tournament:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement du tournoi');
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
            onClick={() => navigate('/tournaments')}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour aux tournois
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEditMode ? 'Modifier le tournoi' : 'Créer un nouveau tournoi'}
          </h1>
        </div>
        <div>
          <button
            type="submit"
            form="tournament-form"
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
                Tournoi {isEditMode ? 'modifié' : 'créé'} avec succès
              </span>
            </div>
          )}

          <form id="tournament-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom du tournoi
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
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="is_multi_day"
                      name="is_multi_day"
                      type="checkbox"
                      checked={formData.is_multi_day}
                      onChange={handleCheckboxChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="is_multi_day" className="font-medium text-gray-700">
                      Tournoi sur plusieurs jours
                    </label>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-3"></div>

              <div className="sm:col-span-2">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  {formData.is_multi_day ? "Date de début" : "Date"}
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              {formData.is_multi_day && (
                <div className="sm:col-span-2">
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                    Date de fin
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="end_date"
                      id="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                      min={formData.date}
                    />
                  </div>
                </div>
              )}

              <div className="sm:col-span-6">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Lieu
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">
                  Organisateur
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="organizer"
                    id="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
                  Email de contact
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="contact_email"
                    id="contact_email"
                    value={formData.contact_email}
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
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                    <option value="in_progress">En cours</option>
                    <option value="completed">Terminé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="combat_rules_id" className="block text-sm font-medium text-gray-700">
                  Règles de combat
                </label>
                <div className="mt-1">
                  <select
                    id="combat_rules_id"
                    name="combat_rules_id"
                    value={formData.combat_rules_id}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Sélectionner des règles</option>
                    {combatRules.map(rule => (
                      <option key={rule.id} value={rule.id}>{rule.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6 border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900">Paramètres du tournoi</h3>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="seeding_method" className="block text-sm font-medium text-gray-700">
                  Méthode de répartition
                </label>
                <div className="mt-1">
                  <select
                    id="seeding_method"
                    name="seeding_method"
                    value={formData.seeding_method}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="belt">Par niveau de ceinture</option>
                    <option value="alphabetical">Par ordre alphabétique</option>
                    <option value="random">Aléatoire</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="pool_size" className="block text-sm font-medium text-gray-700">
                  Taille des poules
                </label>
                <div className="mt-1">
                  <select
                    id="pool_size"
                    name="pool_size"
                    value={formData.pool_size}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="3">3 combattants</option>
                    <option value="4">4 combattants</option>
                    <option value="5">5 combattants</option>
                    <option value="6">6 combattants</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="elimination_type" className="block text-sm font-medium text-gray-700">
                  Type d'élimination
                </label>
                <div className="mt-1">
                  <select
                    id="elimination_type"
                    name="elimination_type"
                    value={formData.elimination_type}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="single">Élimination directe</option>
                    <option value="double">Double repêchage</option>
                    <option value="repechage">Repêchage</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <div className="flex items-start mt-6">
                  <div className="flex items-center h-5">
                    <input
                      id="third_place_match"
                      name="third_place_match"
                      type="checkbox"
                      checked={formData.third_place_match}
                      onChange={handleCheckboxChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="third_place_match" className="font-medium text-gray-700">
                      Match pour la 3ème place
                    </label>
                    <p className="text-gray-500">Organiser un match entre les perdants des demi-finales</p>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="points_for_win" className="block text-sm font-medium text-gray-700">
                  Points pour victoire
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="points_for_win"
                    id="points_for_win"
                    value={formData.points_for_win}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="points_for_draw" className="block text-sm font-medium text-gray-700">
                  Points pour match nul
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="points_for_draw"
                    id="points_for_draw"
                    value={formData.points_for_draw}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="points_for_loss" className="block text-sm font-medium text-gray-700">
                  Points pour défaite
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="points_for_loss"
                    id="points_for_loss"
                    value={formData.points_for_loss}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TournamentForm;