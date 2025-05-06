import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { playerInsertSchema, playerUpdateSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const apiPrefix = "/api";

  // Get all players
  app.get(`${apiPrefix}/players`, async (req, res) => {
    try {
      const players = await storage.getAllPlayers();
      return res.status(200).json(players);
    } catch (error) {
      console.error("Error fetching players:", error);
      return res.status(500).json({ error: "Failed to fetch players" });
    }
  });

  // Get a single player by ID
  app.get(`${apiPrefix}/players/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid player ID" });
      }

      const player = await storage.getPlayerById(id);
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }

      return res.status(200).json(player);
    } catch (error) {
      console.error("Error fetching player:", error);
      return res.status(500).json({ error: "Failed to fetch player" });
    }
  });

  // Create a new player
  app.post(`${apiPrefix}/players`, async (req, res) => {
    try {
      const validatedData = playerInsertSchema.parse(req.body);
      const newPlayer = await storage.createPlayer(validatedData);
      return res.status(201).json(newPlayer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating player:", error);
      return res.status(500).json({ error: "Failed to create player" });
    }
  });

  // Update a player
  app.put(`${apiPrefix}/players/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid player ID" });
      }

      const validatedData = playerUpdateSchema.parse(req.body);
      const updatedPlayer = await storage.updatePlayer(id, validatedData);

      if (!updatedPlayer) {
        return res.status(404).json({ error: "Player not found" });
      }

      return res.status(200).json(updatedPlayer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating player:", error);
      return res.status(500).json({ error: "Failed to update player" });
    }
  });

  // Delete a player
  app.delete(`${apiPrefix}/players/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid player ID" });
      }

      const deletedPlayer = await storage.deletePlayer(id);
      if (!deletedPlayer) {
        return res.status(404).json({ error: "Player not found" });
      }

      return res.status(200).json(deletedPlayer);
    } catch (error) {
      console.error("Error deleting player:", error);
      return res.status(500).json({ error: "Failed to delete player" });
    }
  });

  // Search players by name
  app.get(`${apiPrefix}/players/search/:query`, async (req, res) => {
    try {
      const query = req.params.query;
      const players = await storage.searchPlayers(query);
      return res.status(200).json(players);
    } catch (error) {
      console.error("Error searching players:", error);
      return res.status(500).json({ error: "Failed to search players" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
