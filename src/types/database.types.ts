export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          age_category: string
          weight_category: string
          gender: string
          created_at: string
          updated_at: string | null
          tournament_id: string | null
        }
        Insert: {
          id?: string
          name: string
          age_category: string
          weight_category: string
          gender: string
          created_at?: string
          updated_at?: string | null
          tournament_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          age_category?: string
          weight_category?: string
          gender?: string
          created_at?: string
          updated_at?: string | null
          tournament_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_tournament_id_fkey"
            columns: ["tournament_id"]
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          }
        ]
      }
      clubs: {
        Row: {
          id: string
          name: string
          address: string
          contact_name: string
          contact_email: string
          contact_phone: string
          logo_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          address: string
          contact_name: string
          contact_email: string
          contact_phone: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          address?: string
          contact_name?: string
          contact_email?: string
          contact_phone?: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      combat_rules: {
        Row: {
          id: string
          name: string
          duration: number
          ippon_points: number
          wazaari_points: number
          yuko_points: number
          max_penalties: number
          golden_score: boolean
          golden_score_duration: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          duration: number
          ippon_points: number
          wazaari_points: number
          yuko_points: number
          max_penalties: number
          golden_score: boolean
          golden_score_duration?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          duration?: number
          ippon_points?: number
          wazaari_points?: number
          yuko_points?: number
          max_penalties?: number
          golden_score?: boolean
          golden_score_duration?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      competitors: {
        Row: {
          id: string
          first_name: string
          last_name: string
          club_id: string
          age_category: string
          weight_category: string
          age: number
          belt: string
          license_number: string
          emergency_contact: string
          gender: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          club_id: string
          age_category: string
          weight_category: string
          age: number
          belt: string
          license_number: string
          emergency_contact: string
          gender: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          club_id?: string
          age_category?: string
          weight_category?: string
          age?: number
          belt?: string
          license_number?: string
          emergency_contact?: string
          gender?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competitors_club_id_fkey"
            columns: ["club_id"]
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          }
        ]
      }
      matches: {
        Row: {
          id: string
          category_id: string
          competitor1_id: string
          competitor2_id: string
          score1: number | null
          score2: number | null
          penalties1: number | null
          penalties2: number | null
          winner_id: string | null
          win_method: string | null
          status: string
          round: string
          tatami_id: string | null
          scheduled_time: string | null
          start_time: string | null
          end_time: string | null
          tournament_id: string
          pool_id: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          category_id: string
          competitor1_id: string
          competitor2_id: string
          score1?: number | null
          score2?: number | null
          penalties1?: number | null
          penalties2?: number | null
          winner_id?: string | null
          win_method?: string | null
          status: string
          round: string
          tatami_id?: string | null
          scheduled_time?: string | null
          start_time?: string | null
          end_time?: string | null
          tournament_id: string
          pool_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          category_id?: string
          competitor1_id?: string
          competitor2_id?: string
          score1?: number | null
          score2?: number | null
          penalties1?: number | null
          penalties2?: number | null
          winner_id?: string | null
          win_method?: string | null
          status?: string
          round?: string
          tatami_id?: string | null
          scheduled_time?: string | null
          start_time?: string | null
          end_time?: string | null
          tournament_id?: string
          pool_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_competitor1_id_fkey"
            columns: ["competitor1_id"]
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_competitor2_id_fkey"
            columns: ["competitor2_id"]
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_pool_id_fkey"
            columns: ["pool_id"]
            referencedRelation: "pools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tatami_id_fkey"
            columns: ["tatami_id"]
            referencedRelation: "tatamis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          }
        ]
      }
      pools: {
        Row: {
          id: string
          name: string
          category_id: string
          tournament_id: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          category_id: string
          tournament_id: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          category_id?: string
          tournament_id?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pools_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pools_tournament_id_fkey"
            columns: ["tournament_id"]
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          }
        ]
      }
      pool_competitors: {
        Row: {
          id: string
          pool_id: string
          competitor_id: string
          wins: number
          points: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          pool_id: string
          competitor_id: string
          wins?: number
          points?: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          pool_id?: string
          competitor_id?: string
          wins?: number
          points?: number
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pool_competitors_competitor_id_fkey"
            columns: ["competitor_id"]
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_competitors_pool_id_fkey"
            columns: ["pool_id"]
            referencedRelation: "pools"
            referencedColumns: ["id"]
          }
        ]
      }
      tatamis: {
        Row: {
          id: string
          name: string
          status: string
          table_chief_id: string | null
          referee_id: string | null
          current_match_id: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          status: string
          table_chief_id?: string | null
          referee_id?: string | null
          current_match_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          status?: string
          table_chief_id?: string | null
          referee_id?: string | null
          current_match_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tatamis_current_match_id_fkey"
            columns: ["current_match_id"]
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tatamis_referee_id_fkey"
            columns: ["referee_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tatamis_table_chief_id_fkey"
            columns: ["table_chief_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tournament_settings: {
        Row: {
          id: string
          tournament_id: string
          seeding_method: string
          pool_size: number
          elimination_type: string
          third_place_match: boolean
          points_for_win: number
          points_for_draw: number
          points_for_loss: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          tournament_id: string
          seeding_method: string
          pool_size: number
          elimination_type: string
          third_place_match: boolean
          points_for_win: number
          points_for_draw: number
          points_for_loss: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          tournament_id?: string
          seeding_method?: string
          pool_size?: number
          elimination_type?: string
          third_place_match?: boolean
          points_for_win?: number
          points_for_draw?: number
          points_for_loss?: number
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_settings_tournament_id_fkey"
            columns: ["tournament_id"]
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          }
        ]
      }
      tournaments: {
        Row: {
          id: string
          name: string
          date: string
          location: string
          organizer: string
          contact_email: string
          status: string
          combat_rules_id: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          date: string
          location: string
          organizer: string
          contact_email: string
          status: string
          combat_rules_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          date?: string
          location?: string
          organizer?: string
          contact_email?: string
          status?: string
          combat_rules_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_combat_rules_id_fkey"
            columns: ["combat_rules_id"]
            referencedRelation: "combat_rules"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: string
          club_id: string | null
          last_login: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          role: string
          club_id?: string | null
          last_login?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          role?: string
          club_id?: string | null
          last_login?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_club_id_fkey"
            columns: ["club_id"]
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      volunteers: {
        Row: {
          id: string
          first_name: string
          last_name: string
          club_id: string
          role: string
          time_slots: string[]
          points: number
          status: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          club_id: string
          role: string
          time_slots: string[]
          points?: number
          status: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          club_id?: string
          role?: string
          time_slots?: string[]
          points?: number
          status?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "volunteers_club_id_fkey"
            columns: ["club_id"]
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          }
        ]
      }
      weighing_records: {
        Row: {
          id: string
          competitor_id: string
          weight: number
          status: string
          tournament_id: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          competitor_id: string
          weight: number
          status: string
          tournament_id: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          competitor_id?: string
          weight?: number
          status?: string
          tournament_id?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "weighing_records_competitor_id_fkey"
            columns: ["competitor_id"]
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weighing_records_tournament_id_fkey"
            columns: ["tournament_id"]
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}