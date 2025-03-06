import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle, Check, Plus, X } from 'lucide-react';
import { useClubs } from '../hooks/useClubs';

interface Volunteer {
  id: string;
  first_name: string;
  last_name: string;
  club_id: string;
  role: string;
  time_slots: string[];
  points: number;
  status: string;
  email?: string;
  phone_number?: string;
}

interface TimeSlot {
  id: string;
  name: string;
  day: string;
  start_time: string;
  end_time: string;
}

const VolunteerForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { clubs } = useClubs();
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    club_id: '',
    role: '',
    time_slots: [] as string[],
    points: 0,
    status: 'pending',
    email: '',
    phone_number: ''
  });

  // Créneaux disponibles pour les bénévoles
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([
    { id: '1', name: 'Samedi Matin', day: 'Samedi', start_time: '08:00', end_time: '12:00' },
    { id: '2', name: 'Samedi Après-midi', day: 'Samedi', start_time: '13:00', end_time: '18:00' },
    { id: '3', name: 'Dimanche Matin', day: 'Dimanche', start_time: '08:00', end_time: '12:00' },
    { id: '4', name: 'Dimanche Après-midi', day: 'Dimanche', start_time: '13:00', end_time: '18:00' }
  ]);

  // Mock data for roles
  const roles = [
    'Arbitre',
    'Agent de pesée',
    'Commissaire sportif',
    'Accueil',
    'Logistique',
    'Médical',
    'Sécurité'
  ];

  // Mock function to fetch volunteer data
  const fetchVolunteer = async (id: string) => {
    // Simulate API call
    return new Promise<{ data: Volunteer | null, error: any }>((resolve) => {
      setTimeout(() => {
        const mockVolunteer = {
          id: '1',
          first_name: 'Jean',
          last_name: 'Dupont',
          club_id: clubs[0]?.id || '',
          role: 'Arbitre',
          time_slots: ['Samedi Matin', 'Samedi Après-midi'],
          points: 15,
          status: 'confirmed',
          email: 'jean.dupont@example.com',
          phone_number: '0612345678'
        };
        
        resolve({ data: mockVolunteer, error: null });
      }, 500);
    });
  };

  // Mock function to add volunteer
  const addVolunteer = async (volunteer: Omit<Volunteer, 'id'>) => {
    // Simulate API call
    return new Promise<{ data: Volunteer | null, error: any }>((resolve) => {
      setTimeout(() => {
        resolve({ data: { id: '123', ...volunteer }, error: null });
      }, 500);
    });
  };

  // Mock function to update volunteer
  const updateVolunteer = async (id: string, updates: Partial<Volunteer>) => {
    // Simulate API call
    return new Promise<{ data: Volunteer | null, error: any }>((resolve) => {
      setTimeout(() => {
        resolve({ data: { id, ...updates } as Volunteer, error: null });
      }, 500);
    });
  };

  useEffect(() => {
    const getVolunteer = async () => {
      if (isEditMode && id) {
        try {
          const { data, error } = await fetchVolunteer(id);
          if (error) {
            throw error;
          }
          if (data) {
            setFormData({
              first_name: data.first_name,
              last_name: data.last_name,
              club_id: data.club_id,
              role: data.role,
              time_slots: data.time_slots,
              points: data.points,
              status: data.status,
              email: data.email || '',
              phone_number: data.phone_number || ''
            });
          }
        } catch (err) {
          console.error('Error fetching volunteer:', err);
          setError('Erreur lors du chargement des données du bénévole');
        } finally {
          setLoading(false);
        }
      }
    };

    getVolunteer();
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTimeSlotToggle = (timeSlot: string) => {
    if (formData.time_slots.includes(timeSlot)) {
      setFormData({
        ...formData,
        time_slots: formData.time_slots.filter(slot => slot !== timeSlot)
      });
    } else {
      setFormData({
        ...formData,
        time_slots: [...formData.time_slots, timeSlot]
      });
    }
  };

  const calculatePoints = (timeSlots: string[]) => {
    // Calcul simple: 5 points par créneau, 10 points pour une journée complète
    const points = timeSlots.length * 5;
    
    // Bonus pour journée complète
    const hasSaturdayMorning = timeSlots.includes('Samedi Matin');
    const hasSaturdayAfternoon = timeSlots.includes('Samedi Après-midi');
    const hasSundayMorning = timeSlots.includes('Dimanche Matin');
    const hasSundayAfternoon = timeSlots.includes('Dimanche Après-midi');
    
    let bonus = 0;
    if (hasSaturdayMorning && hasSaturdayAfternoon) bonus += 5;
    if (hasSundayMorning && hasSundayAfternoon) bonus += 5;
    
    return points + bonus;
  };

  const addCustomTimeSlot = () => {
    const newId = `custom-${Date.now()}`;
    setAvailableTimeSlots([
      ...availableTimeSlots,
      {
        id: newId,
        name: 'Nouveau créneau',
        day: 'Samedi',
        start_time: '12:00',
        end_time: '14:00'
      }
    ]);
  };

  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: string) => {
    const updatedTimeSlots = availableTimeSlots.map(slot => {
      if (slot.id === id) {
        const updatedSlot = { ...slot, [field]: value };
        
        // Mettre à jour le nom automatiquement si nécessaire
        if (field === 'day' || field === 'start_time' || field === 'end_time') {
          const startTime = field === 'start_time' ? value : slot.start_time;
          const endTime = field === 'end_time' ? value : slot.end_time;
          const day = field === 'day' ? value : slot.day;
          
          // Formater les heures pour l'affichage
          const formattedStartTime = startTime.substring(0, 5);
          const formattedEndTime = endTime.substring(0, 5);
          
          // Déterminer si c'est matin ou après-midi
          const startHour = parseInt(startTime.split(':')[0], 10);
          const period = startHour < 12 ? 'Matin' : 'Après-midi';
          
          updatedSlot.name = `${day} ${period} (${formattedStartTime}-${formattedEndTime})`;
        }
        
        return updatedSlot;
      }
      return slot;
    });
    
    setAvailableTimeSlots(updatedTimeSlots);
  };

  const removeTimeSlot = (id: string) => {
    // Ne pas supprimer les créneaux par défaut
    if (['1', '2', '3', '4'].includes(id)) {
      return;
    }
    
    setAvailableTimeSlots(availableTimeSlots.filter(slot => slot.id !== id));
    
    // Supprimer également de la sélection si nécessaire
    const slotName = availableTimeSlots.find(slot => slot.id === id)?.name;
    if (slotName && formData.time_slots.includes(slotName)) {
      setFormData({
        ...formData,
        time_slots: formData.time_slots.filter(slot => slot !== slotName)
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    // Calculer les points en fonction des créneaux sélectionnés
    const points = calculatePoints(formData.time_slots);
    
    try {
      if (isEditMode && id) {
        const { error } = await updateVolunteer(id, {
          ...formData,
          points
        });
        
        if (error) {
          throw error;
        }
        
        setSuccess(true);
        setTimeout(() => {
          navigate('/volunteers');
        }, 1500);
      } else {
        const { error } = await addVolunteer({
          ...formData,
          points
        });
        
        if (error) {
          throw error;
        }
        
        setSuccess(true);
        setTimeout(() => {
          navigate('/volunteers');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error saving volunteer:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement du bénévole');
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
            onClick={() => navigate('/volunteers')}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour aux bénévoles
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEditMode ? 'Modifier le bénévole' : 'Ajouter un bénévole'}
          </h1>
        </div>
        <div>
          <button
            type="submit"
            form="volunteer-form"
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
                Bénévole {isEditMode ? 'modifié' : 'ajouté'} avec succès
              </span>
            </div>
          )}

          <form id="volunteer-form" onSubmit={handleSubmit}>
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    name="phone_number"
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Rôle
                </label>
                <div className="mt-1">
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Sélectionner un rôle</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Créneaux disponibles
                  </label>
                  <button
                    type="button"
                    onClick={addCustomTimeSlot}
                    className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Ajouter un créneau personnalisé
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Créneaux par jour */}
                  {['Samedi', 'Dimanche'].map(day => (
                    <div key={day} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">{day}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {availableTimeSlots
                          .filter(slot => slot.day === day)
                          .map(slot => (
                            <div 
                              key={slot.id} 
                              className="flex items-center justify-between p-3 rounded-md border cursor-pointer hover:bg-gray-50"
                            >
                              <div 
                                className={`flex items-center flex-1 ${
                                  formData.time_slots.includes(slot.name) 
                                    ? 'bg-indigo-50 border-indigo-300' 
                                    : 'bg-white border-gray-300'
                                }`}
                                onClick={() => handleTimeSlotToggle(slot.name)}
                              >
                                <div className={`h-5 w-5 rounded-full mr-3 flex items-center justify-center ${
                                  formData.time_slots.includes(slot.name) 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'bg-white border border-gray-300'
                                }`}>
                                  {formData.time_slots.includes(slot.name) && <Check className="h-3 w-3" />}
                                </div>
                                <span className="text-sm font-medium">{slot.name}</span>
                              </div>
                              
                              {!['1', '2', '3', '4'].includes(slot.id) && (
                                <button
                                  type="button"
                                  onClick={() => removeTimeSlot(slot.id)}
                                  className="ml-2 text-red-600 hover:text-red-800"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                              
                              {!['1', '2', '3', '4'].includes(slot.id) && (
                                <div className="ml-2 flex space-x-2">
                                  <select
                                    value={slot.start_time}
                                    onChange={(e) => updateTimeSlot(slot.id, 'start_time', e.target.value)}
                                    className="text-xs border-gray-300 rounded-md"
                                  >
                                    {Array.from({ length: 24 }).map((_, i) => (
                                      <option key={`start-${i}`} value={`${i.toString().padStart(2, '0')}:00`}>
                                        {`${i.toString().padStart(2, '0')}:00`}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="text-xs">-</span>
                                  <select
                                    value={slot.end_time}
                                    onChange={(e) => updateTimeSlot(slot.id, 'end_time', e.target.value)}
                                    className="text-xs border-gray-300 rounded-md"
                                  >
                                    {Array.from({ length: 24 }).map((_, i) => (
                                      <option key={`end-${i}`} value={`${i.toString().padStart(2, '0')}:00`}>
                                        {`${i.toString().padStart(2, '0')}:00`}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
                {formData.time_slots.length === 0 && (
                  <p className="mt-2 text-sm text-red-600">Veuillez sélectionner au moins un créneau</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Points estimés: {calculatePoints(formData.time_slots)} 
                  (5 points par créneau, +5 points bonus pour une journée complète)
                </p>
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
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="cancelled">Annulé</option>
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

export default VolunteerForm;