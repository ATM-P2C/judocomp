import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface MenuCategory {
  id: string;
  name: string;
  order: number;
  created_at: string;
  updated_at: string | null;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  available: boolean;
  order: number;
  image_url: string | null;
  created_at: string;
  updated_at: string | null;
  category?: MenuCategory;
}

export interface Order {
  id: string;
  status: 'pending' | 'completed' | 'cancelled';
  total_amount: number;
  payment_method: 'cash' | 'card' | 'other' | null;
  payment_status: 'pending' | 'paid';
  created_by: string;
  created_at: string;
  updated_at: string | null;
  items?: OrderItem[];
  created_by_user?: {
    first_name: string;
    last_name: string;
  };
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  menu_item?: MenuItem;
}

export interface DashboardMetrics {
  totalSales: number;
  todaySales: number;
  totalOrders: number;
  todayOrders: number;
  averageOrderValue: number;
  topSellingItems: {
    item: MenuItem;
    totalQuantity: number;
    totalRevenue: number;
  }[];
  paymentMethodBreakdown: {
    cash: number;
    card: number;
    other: number;
  };
  hourlyRevenue: {
    hour: number;
    revenue: number;
    orders: number;
  }[];
}

export const useRefreshmentStand = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>({
    totalSales: 0,
    todaySales: 0,
    totalOrders: 0,
    todayOrders: 0,
    averageOrderValue: 0,
    topSellingItems: [],
    paymentMethodBreakdown: { cash: 0, card: 0, other: 0 },
    hourlyRevenue: []
  });

  // Fetch all menu categories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .order('order');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch menu categories');
    }
  };

  // Fetch all menu items with their categories
  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          category:menu_categories(*)
        `)
        .order('order');

      if (error) throw error;
      setMenuItems(data || []);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError('Failed to fetch menu items');
    }
  };

  // Fetch all orders with their items and user info
  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            *,
            menu_item:menu_items(*)
          ),
          created_by_user:users(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
    }
  };

  // Add a new category
  const addCategory = async (category: Omit<MenuCategory, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .insert([category])
        .select();

      if (error) throw error;
      await fetchCategories();
      return { data, error: null };
    } catch (err) {
      console.error('Error adding category:', err);
      return { data: null, error: err };
    }
  };

  // Update a category
  const updateCategory = async (id: string, updates: Partial<MenuCategory>) => {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      await fetchCategories();
      return { data, error: null };
    } catch (err) {
      console.error('Error updating category:', err);
      return { data: null, error: err };
    }
  };

  // Delete a category
  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCategories();
      return { error: null };
    } catch (err) {
      console.error('Error deleting category:', err);
      return { error: err };
    }
  };

  // Add a new menu item
  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at' | 'category'>) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([item])
        .select();

      if (error) throw error;
      await fetchMenuItems();
      return { data, error: null };
    } catch (err) {
      console.error('Error adding menu item:', err);
      return { data: null, error: err };
    }
  };

  // Update a menu item
  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      await fetchMenuItems();
      return { data, error: null };
    } catch (err) {
      console.error('Error updating menu item:', err);
      return { data: null, error: err };
    }
  };

  // Delete a menu item
  const deleteMenuItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchMenuItems();
      return { error: null };
    } catch (err) {
      console.error('Error deleting menu item:', err);
      return { error: err };
    }
  };

  // Create a new order
  const createOrder = async (items: { menu_item_id: string; quantity: number }[]) => {
    try {
      // Start a transaction
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          status: 'pending',
          payment_status: 'pending',
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Calculate prices and create order items
      const orderItems = items.map(item => {
        const menuItem = menuItems.find(mi => mi.id === item.menu_item_id);
        if (!menuItem) throw new Error(`Menu item not found: ${item.menu_item_id}`);
        
        return {
          order_id: orderData.id,
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          unit_price: menuItem.price,
          total_price: menuItem.price * item.quantity
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update order total
      const totalAmount = orderItems.reduce((sum, item) => sum + item.total_price, 0);
      const { error: updateError } = await supabase
        .from('orders')
        .update({ total_amount: totalAmount })
        .eq('id', orderData.id);

      if (updateError) throw updateError;

      await fetchOrders();
      return { data: orderData, error: null };
    } catch (err) {
      console.error('Error creating order:', err);
      return { data: null, error: err };
    }
  };

  // Update order status
  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();

      if (error) throw error;
      await fetchOrders();
      return { data, error: null };
    } catch (err) {
      console.error('Error updating order status:', err);
      return { data: null, error: err };
    }
  };

  // Process payment
  const processPayment = async (id: string, paymentMethod: Order['payment_method']) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          payment_method: paymentMethod,
          payment_status: 'paid',
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      await fetchOrders();
      return { data, error: null };
    } catch (err) {
      console.error('Error processing payment:', err);
      return { data: null, error: err };
    }
  };

  // Add image upload function
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `menu-items/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      return null;
    }
  };

  // Add image deletion function
  const deleteImage = async (url: string) => {
    try {
      const path = url.split('/').pop();
      if (!path) return;

      const { error } = await supabase.storage
        .from('images')
        .remove([`menu-items/${path}`]);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  // Add dashboard metrics calculation
  const calculateDashboardMetrics = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get all completed orders with their items
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            *,
            menu_item:menu_items(*)
          )
        `)
        .eq('status', 'completed')
        .eq('payment_status', 'paid');

      if (ordersError) throw ordersError;

      const completedOrders = ordersData || [];
      const todayOrders = completedOrders.filter(order => 
        new Date(order.created_at) >= today
      );

      // Calculate basic metrics
      const totalSales = completedOrders.reduce((sum, order) => sum + order.total_amount, 0);
      const todaySales = todayOrders.reduce((sum, order) => sum + order.total_amount, 0);
      const averageOrderValue = totalSales / completedOrders.length || 0;

      // Calculate payment method breakdown
      const paymentMethodBreakdown = completedOrders.reduce((acc, order) => ({
        cash: acc.cash + (order.payment_method === 'cash' ? order.total_amount : 0),
        card: acc.card + (order.payment_method === 'card' ? order.total_amount : 0),
        other: acc.other + (order.payment_method === 'other' ? order.total_amount : 0)
      }), { cash: 0, card: 0, other: 0 });

      // Calculate top selling items
      const itemSales = new Map<string, { quantity: number; revenue: number; item: MenuItem }>();
      completedOrders.forEach(order => {
        order.items?.forEach(item => {
          const existing = itemSales.get(item.menu_item_id) || { 
            quantity: 0, 
            revenue: 0, 
            item: item.menu_item!
          };
          itemSales.set(item.menu_item_id, {
            quantity: existing.quantity + item.quantity,
            revenue: existing.revenue + item.total_price,
            item: item.menu_item!
          });
        });
      });

      const topSellingItems = Array.from(itemSales.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map(({ item, quantity, revenue }) => ({
          item,
          totalQuantity: quantity,
          totalRevenue: revenue
        }));

      // Calculate hourly revenue for today
      const hourlyRevenue = Array.from({ length: 24 }, (_, hour) => {
        const ordersInHour = todayOrders.filter(order => {
          const orderHour = new Date(order.created_at).getHours();
          return orderHour === hour;
        });

        return {
          hour,
          revenue: ordersInHour.reduce((sum, order) => sum + order.total_amount, 0),
          orders: ordersInHour.length
        };
      });

      setDashboardMetrics({
        totalSales,
        todaySales,
        totalOrders: completedOrders.length,
        todayOrders: todayOrders.length,
        averageOrderValue,
        topSellingItems,
        paymentMethodBreakdown,
        hourlyRevenue
      });
    } catch (err) {
      console.error('Error calculating dashboard metrics:', err);
    }
  };

  // Add dashboard metrics to initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchCategories(),
          fetchMenuItems(),
          fetchOrders(),
          calculateDashboardMetrics()
        ]);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Set up real-time subscription for orders
    const ordersSubscription = supabase
      .channel('orders-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders' 
      }, () => {
        // Refresh orders and metrics when changes occur
        fetchOrders();
        calculateDashboardMetrics();
      })
      .subscribe();

    return () => {
      ordersSubscription.unsubscribe();
    };
  }, []);

  return {
    categories,
    menuItems,
    orders,
    dashboardMetrics,
    loading,
    error,
    fetchCategories,
    fetchMenuItems,
    fetchOrders,
    addCategory,
    updateCategory,
    deleteCategory,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    createOrder,
    updateOrderStatus,
    processPayment,
    uploadImage,
    deleteImage,
    calculateDashboardMetrics
  };
};