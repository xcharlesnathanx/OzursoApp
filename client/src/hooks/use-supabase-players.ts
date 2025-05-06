import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Player, PlayerInsert, PlayerUpdate } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export function useSupabasePlayers() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Get all players
  const getPlayers = async (): Promise<Player[]> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('players')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      return data as Player[];
    } catch (error: any) {
      console.error('Error fetching players:', error);
      toast({
        title: 'Erro ao buscar jogadores',
        description: error.message || 'Ocorreu um erro ao carregar os jogadores.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Add a new player
  const createPlayer = async (player: PlayerInsert): Promise<Player | null> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('players')
        .insert(player)
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Jogador adicionado',
        description: `${player.name} foi adicionado com sucesso.`,
      });
      
      return data as Player;
    } catch (error: any) {
      console.error('Error creating player:', error);
      toast({
        title: 'Erro ao adicionar jogador',
        description: error.message || 'Ocorreu um erro ao adicionar o jogador.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing player
  const updatePlayer = async (id: number, player: PlayerUpdate): Promise<Player | null> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('players')
        .update(player)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Jogador atualizado',
        description: `${player.name || 'Jogador'} foi atualizado com sucesso.`,
      });
      
      return data as Player;
    } catch (error: any) {
      console.error('Error updating player:', error);
      toast({
        title: 'Erro ao atualizar jogador',
        description: error.message || 'Ocorreu um erro ao atualizar o jogador.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a player
  const deletePlayer = async (id: number, playerName?: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Jogador removido',
        description: playerName 
          ? `${playerName} foi removido com sucesso.` 
          : 'Jogador foi removido com sucesso.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting player:', error);
      toast({
        title: 'Erro ao remover jogador',
        description: error.message || 'Ocorreu um erro ao remover o jogador.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getPlayers,
    createPlayer,
    updatePlayer,
    deletePlayer
  };
}