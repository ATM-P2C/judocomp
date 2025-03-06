import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Competitor {
  id: string;
  first_name: string;
  last_name: string;
  club_id: string;
  age_category: string;
  weight_category: string;
  birth_date: string;
  belt: string;
  license_number: string;
  emergency_contact: string;
  gender: string;
  reference_number?: string;
  created_at: string;
  updated_at: string | null;
  club?: {
    name: string;
  };
}

export const useCompetitors = (clubId?: string) => {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompetitors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('competitors')
        .select(`
          *,
          club:clubs(name)
        `);
      
      if (clubId) {
        query = query.eq('club_id', clubId);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        throw fetchError;
      }
      
      setCompetitors(data || []);
    } catch (err) {
      console.error('Error fetching competitors:', err);
      setError('Failed to fetch competitors');
    } finally {
      setLoading(false);
    }
  };

  const addCompetitor = async (competitor: Omit<Competitor, 'id' | 'created_at' | 'updated_at' | 'club'>) => {
    try {
      const { data, error } = await supabase
        .from('competitors')
        .insert([competitor])
        .select(`
          *,
          club:clubs(name)
        `);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setCompetitors([...competitors, data[0]]);
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Error adding competitor:', err);
      return { data: null, error: err };
    }
  };

  const updateCompetitor = async (id: string, updates: Partial<Omit<Competitor, 'id' | 'created_at' | 'updated_at' | 'club'>>) => {
    try {
      const { data, error } = await supabase
        .from('competitors')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select(`
          *,
          club:clubs(name)
        `);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setCompetitors(competitors.map(competitor => competitor.id === id ? data[0] : competitor));
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Error updating competitor:', err);
      return { data: null, error: err };
    }
  };

  const deleteCompetitor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('competitors')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setCompetitors(competitors.filter(competitor => competitor.id !== id));
      
      return { error: null };
    } catch (err) {
      console.error('Error deleting competitor:', err);
      return { error: err };
    }
  };

  const getCompetitorById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('competitors')
        .select(`
          *,
          club:clubs(name)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Error fetching competitor:', err);
      return { data: null, error: err };
    }
  };

  const bulkImportCompetitors = async (competitors: Omit<Competitor, 'id' | 'created_at' | 'updated_at' | 'club'>[]) => {
    try {
      const { data, error } = await supabase
        .from('competitors')
        .insert(competitors)
        .select();
      
      if (error) {
        throw error;
      }
      
      await fetchCompetitors(); // Refresh the list
      
      return { data, error: null };
    } catch (err) {
      console.error('Error bulk importing competitors:', err);
      return { data: null, error: err };
    }
  };

  useEffect(() => {
    fetchCompetitors();
  }, [clubId]);

  return {
    competitors,
    loading,
    error,
    fetchCompetitors,
    addCompetitor,
    updateCompetitor,
    deleteCompetitor,
    getCompetitorById,
    bulkImportCompetitors
  };
};