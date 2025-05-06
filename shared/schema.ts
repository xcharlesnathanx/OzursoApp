import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Player skills schema
export const skillSchema = z.object({
  saque: z.number().min(1).max(10),
  recepcao: z.number().min(1).max(10),
  passe: z.number().min(1).max(10),
  ataque: z.number().min(1).max(10),
  bloqueio: z.number().min(1).max(10),
  defesa: z.number().min(1).max(10),
  mobilidade: z.number().min(1).max(10),
});

export type PlayerSkills = z.infer<typeof skillSchema>;

// Players table
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  photoUrl: text("photo_url"),
  skills: jsonb("skills").$type<PlayerSkills>().notNull(),
  averageScore: integer("average_score").notNull(),
});

// Create schemas for validation
export const playerInsertSchema = createInsertSchema(players, {
  name: (schema) => schema.min(2, "Nome deve ter pelo menos 2 caracteres"),
  skills: () => skillSchema,
  averageScore: () => z.number().min(1).max(10),
});

export const playerSelectSchema = createSelectSchema(players);

export type PlayerInsert = z.infer<typeof playerInsertSchema>;
export type Player = z.infer<typeof playerSelectSchema>;

// Schema for updating an existing player
export const playerUpdateSchema = playerInsertSchema.partial().required({
  name: true,
  skills: true,
  averageScore: true,
});

export type PlayerUpdate = z.infer<typeof playerUpdateSchema>;
