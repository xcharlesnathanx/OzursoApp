import type { Player } from "@shared/schema";

/**
 * Generate balanced teams based on player skills
 * 
 * Algorithm:
 * 1. Sort players by their average score (descending)
 * 2. Distribute players in a snake draft pattern for better balance
 *    (Team 1, Team 2, Team 3, ..., Team N, Team N, Team N-1, ..., Team 1, Team 1, ...)
 */
export function generateTeams(players: Player[], numTeams: number): Player[][] {
  if (players.length < numTeams) {
    throw new Error(`Not enough players (${players.length}) to create ${numTeams} teams`);
  }
  
  // Sort players by average score (descending)
  const sortedPlayers = [...players].sort((a, b) => b.averageScore - a.averageScore);
  
  // Initialize teams
  const teams: Player[][] = Array.from({ length: numTeams }, () => []);
  
  // Distribute players in a snake draft pattern
  // First pass: 0, 1, 2, 3, ..., n-1
  // Second pass: n-1, n-2, ..., 1, 0
  // And so on
  let direction = 1; // 1 for forward, -1 for backward
  let currentTeamIndex = 0;
  
  for (const player of sortedPlayers) {
    teams[currentTeamIndex].push(player);
    
    // Calculate the next team index based on direction
    currentTeamIndex += direction;
    
    // Reverse direction if we reach the ends
    if (currentTeamIndex >= numTeams) {
      currentTeamIndex = numTeams - 2;
      direction = -1;
    } else if (currentTeamIndex < 0) {
      currentTeamIndex = 1;
      direction = 1;
    }
  }
  
  return teams;
}
