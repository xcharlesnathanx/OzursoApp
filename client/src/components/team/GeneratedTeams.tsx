import { useMemo } from "react";
import type { Player } from "@shared/schema";

interface GeneratedTeamsProps {
  teams: Player[][];
}

export function GeneratedTeams({ teams }: GeneratedTeamsProps) {
  // Calculate team averages and the difference between them
  const teamAverages = useMemo(() => 
    teams.map(team => 
      Math.round(team.reduce((sum, player) => sum + player.averageScore, 0) / team.length * 10) / 10
    ), [teams]);
  
  // Calculate average difference between teams
  const avgDifference = useMemo(() => {
    if (teamAverages.length <= 1) return 0;
    
    let totalDiff = 0;
    let comparisons = 0;
    
    for (let i = 0; i < teamAverages.length; i++) {
      for (let j = i + 1; j < teamAverages.length; j++) {
        totalDiff += Math.abs(teamAverages[i] - teamAverages[j]);
        comparisons++;
      }
    }
    
    return Math.round((totalDiff / comparisons) * 10) / 10;
  }, [teamAverages]);
  
  if (!teams.length) return null;
  
  return (
    <div className="mt-6 fade-in" id="generatedTeams">
      <h3 className="font-poppins font-semibold text-xl text-foreground mb-3">Times Gerados</h3>
      
      <div className="space-y-4">
        {teams.map((team, index) => (
          <div key={index} className="bg-card rounded-xl overflow-hidden shadow-lg">
            <div className="bg-primary px-4 py-2 flex justify-between items-center">
              <h4 className="font-poppins font-bold text-foreground">Time Urso {index + 1}</h4>
              <span className="bg-accent text-accent-foreground font-poppins font-bold rounded-full px-2 py-1 text-sm flex items-center">
                <i className="material-icons text-xs mr-1">star</i>
                <span>{teamAverages[index]}</span>
              </span>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-1 gap-2">
                {team.map(player => (
                  <div key={player.id} className="flex items-center p-2 bg-muted rounded-lg">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-primary-light flex items-center justify-center mr-2">
                      {player.photoUrl ? (
                        <img 
                          src={player.photoUrl} 
                          alt={player.name} 
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '';
                            e.currentTarget.classList.add('hidden');
                            e.currentTarget.parentElement!.innerHTML += '<i class="material-icons text-2xl text-muted-foreground">person</i>';
                          }}
                        />
                      ) : (
                        <i className="material-icons text-2xl text-muted-foreground">person</i>
                      )}
                    </div>
                    <span className="text-foreground">{player.name}</span>
                    <span className="ml-auto bg-accent text-accent-foreground text-xs font-bold rounded-full px-1.5 py-0.5">{player.averageScore}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className="text-muted-foreground text-sm">
          <i className="material-icons text-accent text-base align-text-bottom">info</i>
          Os times foram balanceados utilizando a média de habilidades. Média da diferença entre times: <span className="text-accent font-bold">{avgDifference}</span>
        </p>
      </div>
    </div>
  );
}
