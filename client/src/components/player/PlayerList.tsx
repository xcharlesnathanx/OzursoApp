import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlayerCard } from "@/components/player/PlayerCard";
import { PlayerContext } from "@/contexts/PlayerContext";
import type { Player } from "@shared/schema";

export function PlayerList() {
  const [searchQuery, setSearchQuery] = useState("");
  const { setSelectedPlayer, setIsAddPlayerModalOpen } = useContext(PlayerContext);
  
  const { data: players, isLoading, error } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });
  
  const filteredPlayers = searchQuery && players 
    ? players.filter(player => 
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : players;
  
  return (
    <div className="p-4 fade-in">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <i className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">search</i>
          <input 
            type="text" 
            placeholder="Buscar jogadores..." 
            className="w-full pl-12 pr-4 py-3 bg-muted text-foreground rounded-xl border border-gray-700 focus:outline-none focus:border-accent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full mb-2"></div>
            <p>Carregando jogadores...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            <i className="material-icons text-4xl mb-2">error</i>
            <p>Erro ao carregar jogadores</p>
          </div>
        ) : filteredPlayers && filteredPlayers.length > 0 ? (
          filteredPlayers.map((player) => (
            <PlayerCard 
              key={player.id} 
              player={player} 
              onViewDetails={() => setSelectedPlayer(player)}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <i className="material-icons text-4xl mb-2 text-muted-foreground">person_off</i>
            <p className="text-muted-foreground">
              {searchQuery 
                ? "Nenhum jogador encontrado com esse nome" 
                : "Nenhum jogador cadastrado ainda"}
            </p>
            <button
              onClick={() => setIsAddPlayerModalOpen(true)}
              className="mt-4 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium"
            >
              Adicionar Jogador
            </button>
          </div>
        )}
      </div>
      
      {/* Add Player FAB */}
      <button 
        className="fixed right-6 bottom-20 w-14 h-14 bg-accent hover:bg-accent-light text-accent-foreground rounded-full shadow-lg flex items-center justify-center transition-colors"
        onClick={() => setIsAddPlayerModalOpen(true)}
      >
        <i className="material-icons text-2xl">add</i>
      </button>
    </div>
  );
}
