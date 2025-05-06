import { useState, useEffect, useMemo } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showShareableView, setShowShareableView] = useState(false);
  
  const { toast } = useToast();
  
  const { data: players, isLoading, error } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });
  
  // Initialize selectedPlayerIds when players are loaded
  useEffect(() => {
    if (players && players.length > 0 && selectedPlayerIds.size === 0) {
      const newSelectedIds = new Set<number>();
      players.forEach(player => newSelectedIds.add(player.id));
      setSelectedPlayerIds(newSelectedIds);
    }
  }, [players, selectedPlayerIds]);
  
  // Filter players based on search query
  const filteredPlayers = useMemo(() => {
    if (!players) return [];
    
    if (!searchQuery.trim()) return players;
    
    const query = searchQuery.toLowerCase().trim();
    return players.filter(player => 
      player.name.toLowerCase().includes(query)
    );
  }, [players, searchQuery]);
  
  const togglePlayerSelection = (playerId: number) => {
    const newSelectedIds = new Set(selectedPlayerIds);
    if (newSelectedIds.has(playerId)) {
      newSelectedIds.delete(playerId);
    } else {
      newSelectedIds.add(playerId);
    }
    setSelectedPlayerIds(newSelectedIds);
  };
  
  const selectAllPlayers = () => {
    if (!players) return;
    const newSelectedIds = new Set<number>();
    players.forEach(player => newSelectedIds.add(player.id));
    setSelectedPlayerIds(newSelectedIds);
  };
  
  const deselectAllPlayers = () => {
    setSelectedPlayerIds(new Set());
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
    setShowShareableView(false); // Reset share view when generating new teams
  };
  
  const toggleShareableView = () => {
    setShowShareableView(!showShareableView);
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
          
          {/* Search Bar */}
          <div className="mb-2 relative">
            <input
              type="text"
              placeholder="Buscar jogadores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg bg-muted text-foreground border border-gray-700 focus:outline-none focus:border-accent"
            />
            <i className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">search</i>
            
            {searchQuery && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchQuery("")}
              >
                <i className="material-icons">close</i>
              </button>
            )}
          </div>
          
          {/* Select/Deselect All Buttons */}
          <div className="flex space-x-2 mb-2">
            <button 
              onClick={selectAllPlayers}
              className="text-xs px-2 py-1 rounded bg-primary text-foreground hover:bg-primary-dark transition-colors"
            >
              Selecionar Todos
            </button>
            <button 
              onClick={deselectAllPlayers}
              className="text-xs px-2 py-1 rounded bg-muted-foreground text-muted hover:bg-gray-700 transition-colors"
            >
              Limpar Seleção
            </button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin inline-block w-6 h-6 border-4 border-accent border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              <p>Erro ao carregar jogadores</p>
            </div>
          ) : players && filteredPlayers.length > 0 ? (
            <div className="max-h-60 overflow-y-auto bg-muted p-3 rounded-lg border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {filteredPlayers.map(player => (
                  <div 
                    key={player.id}
                    className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedPlayerIds.has(player.id) 
                        ? 'bg-primary/30 border border-accent/50' 
                        : 'bg-card/50 border border-transparent hover:bg-primary/10'
                    }`}
                    onClick={() => togglePlayerSelection(player.id)}
                  >
                    <span className="relative inline-flex mr-2">
                      <input 
                        type="checkbox" 
                        id={`player-${player.id}`} 
                        checked={selectedPlayerIds.has(player.id)}
                        onChange={(e) => e.stopPropagation()}
                        className="sr-only peer"
                      />
                      <span 
                        className="w-5 h-5 rounded bg-muted border border-gray-700 peer-checked:bg-accent peer-checked:border-accent relative flex items-center justify-center"
                      >
                        {selectedPlayerIds.has(player.id) && (
                          <i className="material-icons text-accent-foreground text-xs">check</i>
                        )}
                      </span>
                    </span>
                    
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-primary-light flex items-center justify-center mr-2">
                      {player.photoUrl ? (
                        <img 
                          src={player.photoUrl} 
                          alt={player.name} 
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.parentElement!.innerHTML = '<i class="material-icons text-xl text-muted-foreground">person</i>';
                          }}
                        />
                      ) : (
                        <i className="material-icons text-xl text-muted-foreground">person</i>
                      )}
                    </div>
                    
                    <label 
                      htmlFor={`player-${player.id}`} 
                      className="text-foreground font-medium flex-1 truncate"
                    >
                      {player.name}
                    </label>
                    <span className="ml-2 bg-accent text-accent-foreground text-xs font-bold rounded-full px-1.5 py-0.5">
                      {player.averageScore.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : players && players.length > 0 && filteredPlayers.length === 0 ? (
            <div className="text-center py-4 bg-muted rounded-lg border border-gray-700">
              <p className="text-muted-foreground">Nenhum jogador encontrado com "{searchQuery}"</p>
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
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-poppins font-semibold text-xl text-foreground">Times Gerados</h3>
            <button
              onClick={toggleShareableView}
              className="px-3 py-1 rounded-lg bg-primary text-foreground text-sm font-medium flex items-center hover:bg-primary-dark"
            >
              <i className="material-icons text-sm mr-1">
                {showShareableView ? "visibility_off" : "share"}
              </i>
              {showShareableView ? "Modo Admin" : "Modo Compartilhável"}
            </button>
          </div>
          <GeneratedTeams teams={generatedTeams} hideScores={showShareableView} />
        </div>
      )}
    </div>
  );
}
