import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Category {
  id: string;
  name: string;
  age_category: string;
  weight_category: string;
  gender: 'male' | 'female';
  tournament_id: string | null;
  created_at: string;
  updated_at: string | null;
  competitors_count?: number;
}

export const useCategories = (tournamentId?: string) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('categories')
        .select('*');
      
      if (tournamentId) {
        query = query.eq('tournament_id', tournamentId);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Get competitor counts for each category
      const categoriesWithCounts = await Promise.all(
        (data || []).map(async (category) => {
          const { count, error: countError } = await supabase
            .from('competitors')
            .select('*', { count: 'exact', head: true })
            .eq('age_category', category.age_category)
            .eq('weight_category', category.weight_category)
            .eq('gender', category.gender);
          
          if (countError) {
            console.error('Error fetching competitor count:', countError);
          }
          
          return {
            ...category,
            competitors_count: count || 0
          };
        })
      );
      
      setCategories(categoriesWithCounts);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'competitors_count'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setCategories([...categories, { ...data[0], competitors_count: 0 }]);
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Error adding category:', err);
      return { data: null, error: err };
    }
  };

  const updateCategory = async (id: string, updates: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at' | 'competitors_count'>>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setCategories(categories.map(category => 
          category.id === id 
            ? { ...category, ...data[0] } 
            : category
        ));
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Error updating category:', err);
      return { data: null, error: err };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setCategories(categories.filter(category => category.id !== id));
      
      return { error: null };
    } catch (err) {
      console.error('Error deleting category:', err);
      return { error: err };
    }
  };

  const getCategoryById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Error fetching category:', err);
      return { data: null, error: err };
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [tournamentId]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
  };
};