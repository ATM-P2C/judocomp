import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Club {
  id: string;
  name: string;
  address: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string | null;
  competitors_count?: number;
  volunteers_count?: number;
}

export const useClubs = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClubs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch clubs
      const { data: clubsData, error: clubsError } = await supabase
        .from('clubs')
        .select('*');
      
      if (clubsError) {
        throw clubsError;
      }
      
      // Fetch competitor counts for each club
      const clubsWithCounts = await Promise.all(
        clubsData.map(async (club) => {
          // Get competitor count
          const { count: competitorsCount, error: competitorsError } = await supabase
            .from('competitors')
            .select('*', { count: 'exact', head: true })
            .eq('club_id', club.id);
          
          if (competitorsError) {
            console.error('Error fetching competitors count:', competitorsError);
          }
          
          // Get volunteer count
          const { count: volunteersCount, error: volunteersError } = await supabase
            .from('volunteers')
            .select('*', { count: 'exact', head: true })
            .eq('club_id', club.id);
          
          if (volunteersError) {
            console.error('Error fetching volunteers count:', volunteersError);
          }
          
          return {
            ...club,
            competitors_count: competitorsCount || 0,
            volunteers_count: volunteersCount || 0,
          };
        })
      );
      
      setClubs(clubsWithCounts);
    } catch (err) {
      console.error('Error fetching clubs:', err);
      setError('Failed to fetch clubs');
    } finally {
      setLoading(false);
    }
  };

  const addClub = async (club: Omit<Club, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('clubs')
        .insert([club])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setClubs([...clubs, { ...data[0], competitors_count: 0, volunteers_count: 0 }]);
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Error adding club:', err);
      return { data: null, error: err };
    }
  };

  const updateClub = async (id: string, updates: Partial<Omit<Club, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('clubs')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setClubs(clubs.map(club => club.id === id ? { ...club, ...data[0] } : club));
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Error updating club:', err);
      return { data: null, error: err };
    }
  };

  const deleteClub = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clubs')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setClubs(clubs.filter(club => club.id !== id));
      
      return { error: null };
    } catch (err) {
      console.error('Error deleting club:', err);
      return { error: err };
    }
  };

  const getClubById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Error fetching club:', err);
      return { data: null, error: err };
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  return {
    clubs,
    loading,
    error,
    fetchClubs,
    addClub,
    updateClub,
    deleteClub,
    getClubById,
  };
};