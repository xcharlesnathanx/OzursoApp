import type { Player } from "@shared/schema";

interface PlayerCardProps {
  player: Player;
  onViewDetails: () => void;
}

export function PlayerCard({ player, onViewDetails }: PlayerCardProps) {
  // Format average score to show 1 decimal place
  const formattedScore = player.averageScore.toFixed(1);
  
  return (
    <div className="player-card bg-card rounded-xl overflow-hidden shadow-lg">
      <div className="flex items-center p-4">
        {/* Player Photo */}
        <div className="w-16 h-16 rounded-full overflow-hidden bg-primary-light flex items-center justify-center mr-4">
          {player.photoUrl ? (
            <img 
              src={player.photoUrl} 
              alt={`Foto de perfil de ${player.name}`} 
              className="object-cover w-full h-full"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '';
                e.currentTarget.classList.add('hidden');
                e.currentTarget.parentElement!.innerHTML += '<i class="material-icons text-4xl text-muted-foreground">person</i>';
              }}
            />
          ) : (
            <i className="material-icons text-4xl text-muted-foreground">person</i>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center">
            {/* Player Name */}
            <h3 className="font-poppins font-semibold text-xl text-foreground">{player.name}</h3>
            
            {/* Edit Button */}
            <div className="flex items-center space-x-3">
              {/* Score Badge */}
              <span className="bg-accent text-accent-foreground font-poppins font-bold rounded-full px-2 py-1 text-sm flex items-center">
                <i className="material-icons text-xs mr-1">star</i>
                <span>{formattedScore}</span>
              </span>
              
              {/* Edit Icon Button */}
              <button 
                className="w-10 h-10 rounded-lg bg-primary text-foreground hover:bg-primary-dark transition-colors flex items-center justify-center"
                onClick={onViewDetails}
                aria-label="Editar jogador"
              >
                <i className="material-icons">edit</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
