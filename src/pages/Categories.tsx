import React, { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

const Categories = () => {
  // Mock data for demonstration
  const ageCategories = [
    { id: 1, name: 'Poussins', ageRange: '8-9 ans', weightCategories: ['-20kg', '-22kg', '-24kg', '-26kg', '-28kg', '-30kg', '-32kg', '-34kg', '-36kg', '-38kg', '-40kg', '+40kg'] },
    { id: 2, name: 'Benjamins', ageRange: '10-11 ans', weightCategories: ['-26kg', '-28kg', '-30kg', '-32kg', '-34kg', '-36kg', '-38kg', '-40kg', '-42kg', '-44kg', '-46kg', '-48kg', '-50kg', '+50kg'] },
    { id: 3, name: 'Minimes', ageRange: '12-13 ans', weightCategories: ['-34kg', '-38kg', '-42kg', '-46kg', '-50kg', '-55kg', '-60kg', '-66kg', '+66kg'] },
    { id: 4, name: 'Cadets', ageRange: '14-15 ans', weightCategories: ['-46kg', '-50kg', '-55kg', '-60kg', '-66kg', '-73kg', '-81kg', '-90kg', '+90kg'] },
    { id: 5, name: 'Juniors', ageRange: '16-17 ans', weightCategories: ['-55kg', '-60kg', '-66kg', '-73kg', '-81kg', '-90kg', '-100kg', '+100kg'] },
    { id: 6, name: 'Seniors', ageRange: '18-34 ans', weightCategories: ['-60kg', '-66kg', '-73kg', '-81kg', '-90kg', '-100kg', '+100kg'] },
    { id: 7, name: 'Vétérans', ageRange: '35+ ans', weightCategories: ['-60kg', '-66kg', '-73kg', '-81kg', '-90kg', '-100kg', '+100kg'] },
  ];

  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  const toggleCategory = (categoryId: number) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestion des catégories</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une catégorie
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            {ageCategories.map((category) => (
              <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.ageRange}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 rounded-full text-indigo-600 hover:bg-indigo-100">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="p-1 rounded-full text-red-600 hover:bg-red-100">
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {expandedCategory === category.id && (
                  <div className="px-4 py-3 border-t border-gray-200">
                    <h4 className="text-md font-medium text-gray-700 mb-2">Catégories de poids</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {category.weightCategories.map((weight, index) => (
                        <div key={index} className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-800 flex justify-between items-center">
                          <span>{weight}</span>
                          <div className="flex space-x-1">
                            <button className="text-indigo-600 hover:text-indigo-800">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="bg-green-50 rounded-md px-3 py-2 text-sm text-green-800 flex justify-center items-center cursor-pointer hover:bg-green-100">
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;