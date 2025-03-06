import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Match {
  id: string;
  category_id: string;
  competitor1_id: string;
  competitor2_id: string;
  score1: number | null;
  score2: number | null;
  penalties1: number | null;
  penalties2: number | null;
  winner_id: string | null;
  win_method: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  round: string;
  tatami_id: string | null;
  scheduled_time: string | null;
  start_time: string | null;
  end_time: string | null;
  tournament_id: string;
  pool_id: string | null;
  created_at: string;
  updated_at: string | null;
  category?: {
    name: string;
  };
  competitor1?: {
    first_name: string;
    last_name: string;
    club: {
      name: string;
    };
  };
  competitor2?: {
    first_name: string;
    last_name: string;
    club: {
      name: string;
    };
  };
  winner?: {
    first_name: string;
    last_name: string;
  };
  tatami?: {
    name: string;
  };
}

export const useMatches = (tournamentId?: string, categoryId?: string, status?: string, tatamiId?: string) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('matches')
        .select(`
          *,
          category:categories(name),
          competitor1:competitors!matches_competitor1_id_fkey(first_name, last_name, club:clubs(name)),
          competitor2:competitors!matches_competitor2_id_fkey(first_name, last_name, club:clubs(name)),
          winner:competitors!matches_winner_id_fkey(first_name, last_name),
          tatami:tatamis!matches_tatami_id_fkey(name)
        `);
      
      if (tournamentId) {
        query = query.eq('tournament_id', tournamentId);
      }
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (tatamiId) {
        query = query.eq('tatami_id', tatamiId);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        throw fetchError;
      }
      
      setMatches(data || []);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const addMatch = async (match: Omit<Match, 'id' | 'created_at' | 'updated_at' | 'category' | 'competitor1' | 'competitor2' | 'winner' | 'tatami'>) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .insert([match])
        .select(`
          *,
          category:categories(name),
          competitor1:competitors!matches_competitor1_id_fkey(first_name, last_name, club:clubs(name)),
          competitor2:competitors!matches_competitor2_id_fkey(first_name, last_name, club:clubs(name)),
          winner:competitors!matches_winner_id_fkey(first_name, last_name),
          tatami:tatamis!matches_tatami_id_fkey(name)
        `);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setMatches([...matches, data[0]]);
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Error adding match:', err);
      return { data: null, error: err };
    }
  };

  const updateMatch = async (id: string, updates: Partial<Match>) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select(`
          *,
          category:categories(name),
          competitor1:competitors!matches_competitor1_id_fkey(first_name, last_name, club:clubs(name)),
          competitor2:competitors!matches_competitor2_id_fkey(first_name, last_name, club:clubs(name)),
          winner:competitors!matches_winner_id_fkey(first_name, last_name),
          tatami:tatamis!matches_tatami_id_fkey(name)
        `);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setMatches(matches.map(match => match.id === id ? data[0] : match));
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Error updating match:', err);
      return { data: null, error: err };
    }
  };

  const deleteMatch = async (id: string) => {
    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setMatches(matches.filter(match => match.id !== id));
      
      return { error: null };
    } catch (err) {
      console.error('Error deleting match:', err);
      return { error: err };
    }
  };

  const getMatchById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          category:categories(name),
          competitor1:competitors!matches_competitor1_id_fkey(first_name, last_name, club:clubs(name)),
          competitor2:competitors!matches_competitor2_id_fkey(first_name, last_name, club:clubs(name)),
          winner:competitors!matches_winner_id_fkey(first_name, last_name),
          tatami:tatamis!matches_tatami_id_fkey(name)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Error fetching match:', err);
      return { data: null, error: err };
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [tournamentId, categoryId, status, tatamiId]);

  return {
    matches,
    loading,
    error,
    fetchMatches,
    addMatch,
    updateMatch,
    deleteMatch,
    getMatchById,
  };
};