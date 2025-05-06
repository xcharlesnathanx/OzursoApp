import type { PlayerSkills } from "@shared/schema";

export function calculateSkillAverage(skills: PlayerSkills): number {
  const values = Object.values(skills);
  const sum = values.reduce((total, value) => total + value, 0);
  return sum / values.length;
}
