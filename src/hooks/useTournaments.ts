import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Tournament {
  id: string;
  name: string;
  date: string;
  location: string;
  organizer: string;
  contact_email: string;
  status: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled';
  combat_rules_id: string | null;
  created_at: string;
  updated_at: string | null;
  combat_rules?: {
    name: string;
  };
}

export interface TournamentSettings {
  id: string;
  tournament_id: string;
  seeding_method: 'belt' | 'alphabetical' | 'random';
  pool_size: number;
  elimination_type: 'single' | 'double' | 'repechage';
  third_place_match: boolean;
  points_for_win: number;
  points_for_draw: number;
  points_for_loss: number;
  created_at: string;
  updated_at: string | null;
}

export const useTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('tournaments')
        .select(`
          *,
          combat_rules(name)
        `);
      
      if (fetchError) {
        throw fetchError;
      }
      
      setTournaments(data || []);
    } catch (err) {
      console.error('Error fetching tournaments:', err);
      setError('Failed to fetch tournaments');
    } finally {
      setLoading(false);
    }
  };

  const addTournament = async (tournament: Omit<Tournament, 'id' | 'created_at' | 'updated_at' | 'combat_rules'>, settings: Omit<TournamentSettings, 'id' | 'tournament_id' | 'created_at' | 'updated_at'>) => {
    try {
      // Start a transaction
      const { data: tournamentData, error: tournamentError } = await supabase
        .from('tournaments')
        .insert([tournament])
        .select();
      
      if (tournamentError) {
        throw tournamentError;
      }
      
      if (!tournamentData || tournamentData.length === 0) {
        throw new Error('Failed to create tournament');
      }
      
      const tournamentId = tournamentData[0].id;
      
      // Add tournament settings
      const { error: settingsError } = await supabase
        .from('tournament_settings')
        .insert([{
          ...settings,
          tournament_id: tournamentId
        }]);
      
      if (settingsError) {
        throw settingsError;
      }
      
      // Fetch the tournament with its combat rules
      const { data: newTournament, error: fetchError } = await supabase
        .from('tournaments')
        .select(`
          *,
          combat_rules(name)
        `)
        .eq('id', tournamentId)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      setTournaments([...tournaments, newTournament]);
      
      return { data: newTournament, error: null };
    } catch (err) {
      console.error('Error adding tournament:', err);
      return { data: null, error: err };
    }
  };

  const updateTournament = async (id: string, updates: Partial<Omit<Tournament, 'id' | 'created_at' | 'updated_at' | 'combat_rules'>>) => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select(`
          *,
          combat_rules(name)
        `);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setTournaments(tournaments.map(tournament => tournament.id === id ? data[0] : tournament));
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Error updating tournament:', err);
      return { data: null, error: err };
    }
  };

  const deleteTournament = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tournaments')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setTournaments(tournaments.filter(tournament => tournament.id !== id));
      
      return { error: null };
    } catch (err) {
      console.error('Error deleting tournament:', err);
      return { error: err };
    }
  };

  const getTournamentById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          *,
          combat_rules(name)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Error fetching tournament:', err);
      return { data: null, error: err };
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  return {
    tournaments,
    loading,
    error,
    fetchTournaments,
    addTournament,
    updateTournament,
    deleteTournament,
    getTournamentById
  };
};