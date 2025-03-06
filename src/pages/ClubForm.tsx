import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle, Check, Upload, Trash } from 'lucide-react';
import { useClubs } from '../hooks/useClubs';

const ClubForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { getClubById, addClub, updateClub } = useClubs();
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    logo_url: null as string | null
  });

  useEffect(() => {
    const fetchClub = async () => {
      if (isEditMode && id) {
        try {
          const { data, error } = await getClubById(id);
          if (error) {
            throw error;
          }
          if (data) {
            setFormData({
              name: data.name,
              address: data.address,
              contact_name: data.contact_name,
              contact_email: data.contact_email,
              contact_phone: data.contact_phone,
              logo_url: data.logo_url
            });
          }
        } catch (err) {
          console.error('Error fetching club:', err);
          setError('Erreur lors du chargement des données du club');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchClub();
  }, [id, isEditMode, getClubById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simuler le téléchargement d'un logo
      // Dans une application réelle, vous téléchargeriez le fichier sur un serveur
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          logo_url: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setFormData({
      ...formData,
      logo_url: null
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    try {
      if (isEditMode && id) {
        const { error } = await updateClub(id, formData);
        if (error) {
          throw error;
        }
        setSuccess(true);
        setTimeout(() => {
          navigate('/clubs');
        }, 1500);
      } else {
        const { error } = await addClub(formData);
        if (error) {
          throw error;
        }
        setSuccess(true);
        setTimeout(() => {
          navigate('/clubs');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error saving club:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement du club');
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
            onClick={() => navigate('/clubs')}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour aux clubs
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEditMode ? 'Modifier le club' : 'Ajouter un club'}
          </h1>
        </div>
        <div>
          <button
            type="submit"
            form="club-form"
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
                Club {isEditMode ? 'modifié' : 'ajouté'} avec succès
              </span>
            </div>
          )}

          <form id="club-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom du club
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

              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Adresse
                </label>
                <div className="mt-1">
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Logo du club
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                    {formData.logo_url ? (
                      <img src={formData.logo_url} alt="Logo" className="h-16 w-16 object-contain" />
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
                    {formData.logo_url && (
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
                <p className="mt-2 text-sm text-gray-500">
                  PNG, JPG, GIF jusqu'à 10MB
                </p>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700">
                  Nom du contact
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="contact_name"
                    id="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
                  Email du contact
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
                <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">
                  Téléphone du contact
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    name="contact_phone"
                    id="contact_phone"
                    value={formData.contact_phone}
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

export default ClubForm;