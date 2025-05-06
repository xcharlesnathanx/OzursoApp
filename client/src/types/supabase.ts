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
      players: {
        Row: {
          id: number
          name: string
          photoUrl: string | null
          skills: {
            saque: number
            recepcao: number
            passe: number
            ataque: number
            bloqueio: number
            defesa: number
            mobilidade: number
          }
          averageScore: number
        }
        Insert: {
          name: string
          photoUrl?: string | null
          skills: {
            saque: number
            recepcao: number
            passe: number
            ataque: number
            bloqueio: number
            defesa: number
            mobilidade: number
          }
          averageScore?: number
        }
        Update: {
          id?: number
          name?: string
          photoUrl?: string | null
          skills?: {
            saque?: number
            recepcao?: number
            passe?: number
            ataque?: number
            bloqueio?: number
            defesa?: number
            mobilidade?: number
          }
          averageScore?: number
        }
        Relationships: []
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
  }
}