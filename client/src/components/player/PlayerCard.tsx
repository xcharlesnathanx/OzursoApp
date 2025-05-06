import { SkillBar } from "@/components/ui/skill-bar";
import type { Player } from "@shared/schema";

interface PlayerCardProps {
  player: Player;
  onViewDetails: () => void;
}

export function PlayerCard({ player, onViewDetails }: PlayerCardProps) {
  // Find the two highest skills
  const skillEntries = Object.entries(player.skills);
  const sortedSkills = [...skillEntries].sort((a, b) => b[1] - a[1]);
  const topSkills = sortedSkills.slice(0, 2);
  
  const skillNames: Record<string, string> = {
    saque: "Saque",
    recepcao: "Recepção",
    passe: "Passe",
    ataque: "Ataque",
    bloqueio: "Bloqueio",
    defesa: "Defesa",
    mobilidade: "Mobilidade"
  };
  
  return (
    <div className="player-card bg-card rounded-xl overflow-hidden shadow-lg">
      <div className="flex items-start p-4">
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
          <div className="flex justify-between items-start">
            <h3 className="font-poppins font-semibold text-xl text-foreground">{player.name}</h3>
            <span className="bg-accent text-accent-foreground font-poppins font-bold rounded-full px-2 py-1 text-sm flex items-center">
              <i className="material-icons text-xs mr-1">star</i>
              <span>{player.averageScore}</span>
            </span>
          </div>

          {/* Top skills preview */}
          <div className="mt-2 space-y-1">
            {topSkills.map(([skillKey, skillValue]) => (
              <div key={skillKey}>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span className="font-poppins">{skillNames[skillKey]}</span>
                  <span>{skillValue}</span>
                </div>
                <SkillBar value={skillValue} />
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-end space-x-2">
            <button 
              className="px-3 py-1 rounded-lg bg-primary text-foreground text-sm font-medium flex items-center hover:bg-primary-dark"
              onClick={onViewDetails}
            >
              <i className="material-icons text-sm mr-1">visibility</i>
              Detalhes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
