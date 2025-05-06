import { useMemo } from "react";
import { useMobile } from "@/hooks/use-mobile";
import type { Player } from "@shared/schema";

interface GeneratedTeamsProps {
  teams: Player[][];
  hideScores?: boolean;
}

export function GeneratedTeams({ teams, hideScores = false }: GeneratedTeamsProps) {
  const isMobile = useMobile();
  
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
  
  // Copy to clipboard function
  const copyToClipboard = () => {
    try {
      // Create a text representation of the teams
      let teamsText = "🐻 OZURSO - TIMES GERADOS 🏐\n\n";
      
      teams.forEach((team, index) => {
        teamsText += `⭐ TIME ${index + 1}:\n`;
        team.forEach(player => {
          teamsText += `• ${player.name}\n`;
        });
        teamsText += "\n";
      });
      
      teamsText += "🐻 Feito com Ozurso App 🏐";
      
      navigator.clipboard.writeText(teamsText);
      
      // Create a simple visual confirmation
      const notification = document.createElement('div');
      notification.textContent = 'Times copiados para a área de transferência!';
      notification.style.position = 'fixed';
      notification.style.bottom = '20px';
      notification.style.left = '50%';
      notification.style.transform = 'translateX(-50%)';
      notification.style.backgroundColor = '#10b981';
      notification.style.color = 'white';
      notification.style.padding = '10px 20px';
      notification.style.borderRadius = '4px';
      notification.style.zIndex = '1000';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  
  if (!teams.length) return null;
  
  return (
    <div className="fade-in" id="generatedTeams">
      <div className="space-y-4">
        {/* Shareable View Controls */}
        {hideScores && (
          <div className="mb-4 p-3 bg-accent/20 rounded-lg border border-accent/30">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
              <p className="text-foreground">
                <i className="material-icons text-accent align-middle mr-1">visibility</i>
                <span className="align-middle">Modo de visualização para compartilhamento (sem pontuações)</span>
              </p>
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium flex items-center hover:bg-accent/80 transition-colors"
              >
                <i className="material-icons text-sm mr-1">content_copy</i>
                Copiar Times
              </button>
            </div>
          </div>
        )}
      
        {teams.map((team, index) => (
          <div key={index} className="bg-card rounded-xl overflow-hidden shadow-lg">
            <div className="bg-primary px-4 py-2 flex justify-between items-center">
              <div className="flex items-center">
                <img 
                  src="/ozurso-logo.png" 
                  alt="Ozurso Logo" 
                  className="h-8 w-8 mr-2 object-contain" 
                />
                <h4 className="font-poppins font-bold text-foreground">Time Urso {index + 1}</h4>
              </div>
              
              {!hideScores && (
                <span className="bg-accent text-accent-foreground font-poppins font-bold rounded-full px-2 py-1 text-sm flex items-center">
                  <i className="material-icons text-xs mr-1">star</i>
                  <span>{teamAverages[index].toFixed(1)}</span>
                </span>
              )}
            </div>
            <div className="p-3">
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
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
                    {!hideScores && (
                      <span className="ml-auto bg-accent text-accent-foreground text-xs font-bold rounded-full px-1.5 py-0.5">{player.averageScore.toFixed(1)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!hideScores && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-muted-foreground text-sm">
            <i className="material-icons text-accent text-base align-text-bottom">info</i>
            Os times foram balanceados utilizando a média de habilidades. Média da diferença entre times: <span className="text-accent font-bold">{avgDifference}</span>
          </p>
        </div>
      )}
    </div>
  );
}
