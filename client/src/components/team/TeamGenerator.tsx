import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GeneratedTeams } from "@/components/team/GeneratedTeams";
import { generateTeams } from "@/lib/utils/generate-teams";
import { useToast } from "@/hooks/use-toast";
import type { Player } from "@shared/schema";

export function TeamGenerator() {
  const [teamCount, setTeamCount] = useState(2);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<number>>(new Set());
  const [generatedTeams, setGeneratedTeams] = useState<Player[][]>([]);
  const [showTeams, setShowTeams] = useState(false);
  
  const { toast } = useToast();
  
  const { data: players, isLoading, error } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });
  
  // Initialize selectedPlayerIds when players are loaded
  useState(() => {
    if (players && players.length > 0 && selectedPlayerIds.size === 0) {
      const newSelectedIds = new Set<number>();
      players.forEach(player => newSelectedIds.add(player.id));
      setSelectedPlayerIds(newSelectedIds);
    }
  });
  
  const togglePlayerSelection = (playerId: number) => {
    const newSelectedIds = new Set(selectedPlayerIds);
    if (newSelectedIds.has(playerId)) {
      newSelectedIds.delete(playerId);
    } else {
      newSelectedIds.add(playerId);
    }
    setSelectedPlayerIds(newSelectedIds);
  };
  
  const handleGenerateTeams = () => {
    if (!players) return;
    
    const selectedPlayers = players.filter(player => selectedPlayerIds.has(player.id));
    
    if (selectedPlayers.length < teamCount) {
      toast({
        title: "Jogadores insuficientes",
        description: `Selecione pelo menos ${teamCount} jogadores para gerar ${teamCount} times.`,
        variant: "destructive",
      });
      return;
    }
    
    const teams = generateTeams(selectedPlayers, teamCount);
    setGeneratedTeams(teams);
    setShowTeams(true);
  };
  
  return (
    <div className="p-4 fade-in">
      <div className="bg-card rounded-xl p-4 shadow-lg">
        <h2 className="font-poppins text-xl font-bold text-foreground mb-4">Gerador de Times</h2>
        
        <div className="mb-6">
          <label className="block text-muted-foreground font-poppins font-medium mb-2">Número de Times</label>
          <select 
            className="w-full px-4 py-3 rounded-lg bg-muted text-foreground border border-gray-700 focus:outline-none focus:border-accent"
            value={teamCount}
            onChange={(e) => setTeamCount(parseInt(e.target.value))}
          >
            <option value={2}>2 Times</option>
            <option value={3}>3 Times</option>
            <option value={4}>4 Times</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-muted-foreground font-poppins font-medium mb-2">Jogadores Disponíveis</label>
          
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin inline-block w-6 h-6 border-4 border-accent border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              <p>Erro ao carregar jogadores</p>
            </div>
          ) : players && players.length > 0 ? (
            <div className="max-h-48 overflow-y-auto bg-muted p-3 rounded-lg border border-gray-700">
              {players.map(player => (
                <div className="flex items-center mb-2 last:mb-0" key={player.id}>
                  <input 
                    type="checkbox" 
                    id={`player-${player.id}`} 
                    checked={selectedPlayerIds.has(player.id)}
                    onChange={() => togglePlayerSelection(player.id)}
                    className="w-5 h-5 rounded border-gray-700 text-accent focus:ring-accent bg-muted"
                  />
                  <label htmlFor={`player-${player.id}`} className="ml-2 text-foreground">{player.name}</label>
                  <span className="ml-auto bg-accent text-accent-foreground text-xs font-bold rounded-full px-1.5 py-0.5">{player.averageScore}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 bg-muted rounded-lg border border-gray-700">
              <p className="text-muted-foreground">Nenhum jogador cadastrado</p>
            </div>
          )}
        </div>

        <button 
          className="w-full py-3 rounded-lg bg-accent hover:bg-accent-light text-accent-foreground font-poppins font-bold text-lg flex items-center justify-center transition-colors"
          onClick={handleGenerateTeams}
          disabled={isLoading || !players || players.length < 2 || selectedPlayerIds.size < 2}
        >
          <i className="material-icons mr-2">groups</i>
          Gerar Times
        </button>
      </div>

      {/* Generated Teams Section */}
      {showTeams && generatedTeams.length > 0 && (
        <GeneratedTeams teams={generatedTeams} />
      )}
    </div>
  );
}
