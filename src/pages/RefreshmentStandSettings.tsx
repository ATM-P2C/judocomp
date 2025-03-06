import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft, Edit, Trash, Save, AlertCircle, Check, Move } from 'lucide-react';
import { useRefreshmentStand, MenuCategory, MenuItem } from '../hooks/useRefreshmentStand';

const RefreshmentStandSettings = () => {
  const {
    categories,
    menuItems,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
  } = useRefreshmentStand();

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    order: 0
  });

  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    category_id: '',
    price: 0,
    available: true,
    order: 0
  });

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    try {
      if (editingCategory) {
        const { error } = await updateCategory(editingCategory.id, categoryForm);
        if (error) throw error;
        setSuccess('Catégorie mise à jour avec succès');
      } else {
        const { error } = await addCategory(categoryForm);
        if (error) throw error;
        setSuccess('Catégorie ajoutée avec succès');
      }
      
      setCategoryForm({ name: '', order: 0 });
      setEditingCategory(null);
      setShowAddCategory(false);
    } catch (err: any) {
      setFormError(err.message || 'Une erreur est survenue');
    }
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    try {
      if (editingItem) {
        const { error } = await updateMenuItem(editingItem.id, itemForm);
        if (error) throw error;
        setSuccess('Article mis à jour avec succès');
      } else {
        const { error } = await addMenuItem(itemForm);
        if (error) throw error;
        setSuccess('Article ajouté avec succès');
      }
      
      setItemForm({
        name: '',
        description: '',
        category_id: '',
        price: 0,
        available: true,
        order: 0
      });
      setEditingItem(null);
      setShowAddItem(false);
    } catch (err: any) {
      setFormError(err.message || 'Une erreur est survenue');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      const { error } = await deleteCategory(id);
      if (error) {
        setFormError(error.message || 'Une erreur est survenue');
      } else {
        setSuccess('Catégorie supprimée avec succès');
      }
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      const { error } = await deleteMenuItem(id);
      if (error) {
        setFormError(error.message || 'Une erreur est survenue');
      } else {
        setSuccess('Article supprimé avec succès');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link
            to="/refreshment-stand"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour à la buvette
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Paramètres de la buvette</h1>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {formError && (
        <div className="mb-4 p-4 bg-red-50 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
          <span className="text-red-700">{formError}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 rounded-md flex items-start">
          <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {/* Categories */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Catégories</h2>
            <button
              onClick={() => {
                setShowAddCategory(true);
                setEditingCategory(null);
                setCategoryForm({ name: '', order: 0 });
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une catégorie
            </button>
          </div>

          {showAddCategory && (
            <form onSubmit={handleCategorySubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">
                    Nom de la catégorie
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="category-name"
                      id="category-name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="category-order" className="block text-sm font-medium text-gray-700">
                    Ordre d'affichage
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="category-order"
                      id="category-order"
                      value={categoryForm.order}
                      onChange={(e) => setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) })}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCategory(false);
                    setEditingCategory(null);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingCategory ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">Ordre: {category.order}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setCategoryForm({
                        name: category.name,
                        order: category.order
                      });
                      setShowAddCategory(true);
                    }}
                    className="p-2 text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-red-600 hover:text-red-900"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Articles</h2>
            <button
              onClick={() => {
                setShowAddItem(true);
                setEditingItem(null);
                setItemForm({
                  name: '',
                  description: '',
                  category_id: '',
                  price: 0,
                  available: true,
                  order: 0
                });
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un article
            </button>
          </div>

          {showAddItem && (
            <form onSubmit={handleItemSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="item-name" className="block text-sm font-medium text-gray-700">
                    Nom de l'article
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="item-name"
                      id="item-name"
                      value={itemForm.name}
                      onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="item-category" className="block text-sm font-medium text-gray-700">
                    Catégorie
                  </label>
                  <div className="mt-1">
                    <select
                      id="item-category"
                      name="item-category"
                      value={itemForm.category_id}
                      onChange={(e) => setItemForm({ ...itemForm, category_id: e.target.value })}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="item-description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="item-description"
                      name="item-description"
                      rows={3}
                      value={itemForm.description}
                      onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="item-price" className="block text-sm font-medium text-gray-700">
                    Prix (€)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      step="0.01"
                      name="item-price"
                      id="item-price"
                      value={itemForm.price}
                      onChange={(e) => setItemForm({ ...itemForm, price: parseFloat(e.target.value) })}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="item-order" className="block text-sm font-medium text-gray-700">
                    Ordre d'affichage
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="item-order"
                      id="item-order"
                      value={itemForm.order}
                      onChange={(e) => setItemForm({ ...itemForm, order: parseInt(e.target.value) })}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center h-full">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={itemForm.available}
                        onChange={(e) => setItemForm({ ...itemForm, available: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Disponible</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddItem(false);
                    setEditingItem(null);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingItem ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {categories.map((category) => {
              const categoryItems = menuItems.filter(item => item.category_id === category.id);
              if (categoryItems.length === 0) return null;

              return (
                <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 flex items-center justify-between hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-medium text-gray-900">{item.name}</h4>
                            <span className="text-lg font-semibold text-gray-900">
                              {item.price.toFixed(2)}€
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                          )}
                          <div className="flex items-center mt-2">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.available
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {item.available ? 'Disponible' : 'Indisponible'}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
                              Ordre: {item.order}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setItemForm({
                                name: item.name,
                                description: item.description || '',
                                category_id: item.category_id,
                                price: item.price,
                                available: item.available,
                                order: item.order
                              });
                              setShowAddItem(true);
                            }}
                            className="p-2 text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 text-red-600 hover:text-red-900"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefreshmentStandSettings;