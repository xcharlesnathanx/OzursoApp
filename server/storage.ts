import { db } from "@db";
import { players } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { Player, PlayerInsert, PlayerUpdate } from "@shared/schema";

export const storage = {
  // Get all players
  getAllPlayers: async (): Promise<Player[]> => {
    return await db.select().from(players).orderBy(players.name);
  },

  // Get player by ID
  getPlayerById: async (id: number): Promise<Player | undefined> => {
    const result = await db.select().from(players).where(eq(players.id, id));
    return result[0];
  },

  // Create a new player
  createPlayer: async (player: PlayerInsert): Promise<Player> => {
    const result = await db.insert(players).values(player).returning();
    return result[0];
  },

  // Update a player
  updatePlayer: async (id: number, player: PlayerUpdate): Promise<Player | undefined> => {
    const result = await db
      .update(players)
      .set(player)
      .where(eq(players.id, id))
      .returning();
    return result[0];
  },

  // Delete a player
  deletePlayer: async (id: number): Promise<Player | undefined> => {
    const result = await db
      .delete(players)
      .where(eq(players.id, id))
      .returning();
    return result[0];
  },

  // Search players by name
  searchPlayers: async (query: string): Promise<Player[]> => {
    return await db
      .select()
      .from(players)
      .where(db.sql`${players.name} ILIKE ${`%${query}%`}`)
      .orderBy(players.name);
  },
};
