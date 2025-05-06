import { db } from "./index";
import { players } from "@shared/schema";
import type { PlayerInsert } from "@shared/schema";

async function seed() {
  try {
    // Check if players already exist to avoid duplicates
    const existingPlayers = await db.select().from(players);
    
    if (existingPlayers.length === 0) {
      console.log("Seeding players...");
      
      // Sample player data
      const samplePlayers: PlayerInsert[] = [
        {
          name: "Marco Silva",
          photoUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
          skills: {
            saque: 7,
            recepcao: 6,
            passe: 7,
            ataque: 8,
            bloqueio: 9,
            defesa: 8,
            mobilidade: 7
          },
          averageScore: 7
        },
        {
          name: "Ana Costa",
          photoUrl: "https://images.unsplash.com/photo-1498075702571-ecb018f3752d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
          skills: {
            saque: 7,
            recepcao: 8,
            passe: 9,
            ataque: 7,
            bloqueio: 8,
            defesa: 8,
            mobilidade: 9
          },
          averageScore: 8
        },
        {
          name: "Carlos Mendes",
          photoUrl: "https://images.unsplash.com/photo-1574271143515-5cddf8da19be?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
          skills: {
            saque: 8,
            recepcao: 6,
            passe: 6,
            ataque: 7,
            bloqueio: 6,
            defesa: 7,
            mobilidade: 6
          },
          averageScore: 7
        },
        {
          name: "Luisa Fernandes",
          photoUrl: "",
          skills: {
            saque: 8,
            recepcao: 8,
            passe: 7,
            ataque: 9,
            bloqueio: 7,
            defesa: 8,
            mobilidade: 8
          },
          averageScore: 8
        },
        {
          name: "Rodrigo Santos",
          photoUrl: "",
          skills: {
            saque: 6,
            recepcao: 7,
            passe: 7,
            ataque: 8,
            bloqueio: 6,
            defesa: 8,
            mobilidade: 7
          },
          averageScore: 7
        },
        {
          name: "Carla Almeida",
          photoUrl: "",
          skills: {
            saque: 9,
            recepcao: 8,
            passe: 9,
            ataque: 8,
            bloqueio: 8,
            defesa: 9,
            mobilidade: 8
          },
          averageScore: 8
        }
      ];
      
      // Insert sample players
      await db.insert(players).values(samplePlayers);
      console.log(`Seeded ${samplePlayers.length} players successfully`);
    } else {
      console.log(`Database already contains ${existingPlayers.length} players. Skipping seed.`);
    }
  }
  catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
