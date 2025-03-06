import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash, ShoppingCart, Check, X, Minus } from 'lucide-react';
import { useRefreshmentStand, MenuItem, Order } from '../hooks/useRefreshmentStand';

const RefreshmentStand = () => {
  const {
    categories,
    menuItems,
    orders,
    loading,
    error,
    createOrder,
    processPayment
  } = useRefreshmentStand();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);

  // Filter menu items based on search and category
  const filteredItems = menuItems.filter(item => 
    (!selectedCategory || item.category_id === selectedCategory) &&
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate cart total
  const cartTotal = cart.reduce((sum, { item, quantity }) => sum + (item.price * quantity), 0);

  const addToCart = (item: MenuItem) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(cartItem => cartItem.item.id === item.id);
      if (existingItem) {
        return currentCart.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...currentCart, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(currentCart => currentCart.filter(cartItem => cartItem.item.id !== itemId));
    } else {
      setCart(currentCart =>
        currentCart.map(cartItem =>
          cartItem.item.id === itemId
            ? { ...cartItem, quantity }
            : cartItem
        )
      );
    }
  };

  const handleCheckout = async (paymentMethod: Order['payment_method']) => {
    try {
      const { error } = await createOrder(
        cart.map(({ item, quantity }) => ({
          menu_item_id: item.id,
          quantity
        }))
      );

      if (error) throw error;

      // Clear cart and hide it
      setCart([]);
      setShowCart(false);
    } catch (err) {
      console.error('Error creating order:', err);
      alert('Une erreur est survenue lors de la création de la commande');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Buvette</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCart(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Panier ({cart.length})
          </button>
          <Link
            to="/refreshment-stand/settings"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Gérer les articles
          </Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="w-full md:w-1/3 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Menu items grid */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-500">{item.description}</p>
                    )}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {item.price.toFixed(2)}€
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.available ? 'Disponible' : 'Indisponible'}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    disabled={!item.available}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shopping cart modal */}
      {showCart && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50">
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setShowCart(false)}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Panier
                    </h3>
                    <div className="mt-4">
                      {cart.length === 0 ? (
                        <p className="text-sm text-gray-500">Le panier est vide</p>
                      ) : (
                        <div className="space-y-4">
                          {cart.map(({ item, quantity }) => (
                            <div key={item.id} className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-500">{item.price.toFixed(2)}€</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(item.id, quantity - 1)}
                                  className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="text-sm font-medium w-8 text-center">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, quantity + 1)}
                                  className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between items-center">
                              <span className="text-base font-medium text-gray-900">Total</span>
                              <span className="text-base font-medium text-gray-900">
                                {cartTotal.toFixed(2)}€
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
                  <button
                    type="button"
                    onClick={() => handleCheckout('cash')}
                    disabled={cart.length === 0}
                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:w-auto"
                  >
                    Payer en espèces
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCheckout('card')}
                    disabled={cart.length === 0}
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto"
                  >
                    Payer par carte
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCart(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefreshmentStand;