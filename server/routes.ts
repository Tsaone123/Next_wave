import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPlaylistSchema, 
  insertEventSchema, 
  insertDirectoryPlaylistSchema, 
  insertArtistOfWeekSchema, 
  insertNomineeSchema, 
  insertCreativeSchema, 
  insertVoteSchema,
  type DirectoryPlaylist,
  type ArtistOfWeek,
  type Nominee,
  type Creative
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Playlists
  app.get("/api/playlists", async (req, res) => {
    const playlists = await storage.getPlaylists();
    res.json(playlists);
  });

  app.post("/api/playlists", async (req, res) => {
    try {
      const data = insertPlaylistSchema.parse(req.body);
      const playlist = await storage.createPlaylist(data);
      res.json(playlist);
    } catch (error) {
      res.status(400).json({ error: "Invalid playlist data" });
    }
  });

  app.delete("/api/playlists/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deletePlaylist(id);
    res.json({ success: true });
  });

  // Events
  app.get("/api/events", async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.post("/api/events", async (req, res) => {
    try {
      const data = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(data);
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const data = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(id, data);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteEvent(id);
    res.json({ success: true });
  });

  // Directory Playlists
  app.get("/api/directory-playlists", async (req, res) => {
    const playlists = await storage.getDirectoryPlaylists();
    res.json(playlists);
  });

  app.post("/api/directory-playlists", async (req, res) => {
    try {
      const data = insertDirectoryPlaylistSchema.parse(req.body);
      const playlist = await storage.createDirectoryPlaylist(data);
      res.json(playlist);
    } catch (error) {
      res.status(400).json({ error: "Invalid directory playlist data" });
    }
  });

  app.put("/api/directory-playlists/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const data = insertDirectoryPlaylistSchema.partial().parse(req.body);
      const playlist = await storage.updateDirectoryPlaylist(id, data as Partial<DirectoryPlaylist>);
      if (!playlist) {
        return res.status(404).json({ error: "Directory playlist not found" });
      }
      res.json(playlist);
    } catch (error) {
      res.status(400).json({ error: "Invalid directory playlist data" });
    }
  });

  app.delete("/api/directory-playlists/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteDirectoryPlaylist(id);
    res.json({ success: true });
  });

  // Artist of Week
  app.get("/api/artist-of-week", async (req, res) => {
    const artist = await storage.getArtistOfWeek();
    res.json(artist);
  });

  app.post("/api/artist-of-week", async (req, res) => {
    try {
      const data = insertArtistOfWeekSchema.parse(req.body);
      const artist = await storage.createArtistOfWeek(data);
      res.json(artist);
    } catch (error) {
      res.status(400).json({ error: "Invalid artist data" });
    }
  });

  app.put("/api/artist-of-week/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const data = insertArtistOfWeekSchema.partial().parse(req.body);
      const artist = await storage.updateArtistOfWeek(id, data as Partial<ArtistOfWeek>);
      if (!artist) {
        return res.status(404).json({ error: "Artist not found" });
      }
      res.json(artist);
    } catch (error) {
      res.status(400).json({ error: "Invalid artist data" });
    }
  });

  // Nominees
  app.get("/api/nominees", async (req, res) => {
    const nominees = await storage.getNominees();
    res.json(nominees);
  });

  app.post("/api/nominees", async (req, res) => {
    try {
      const data = insertNomineeSchema.parse(req.body);
      const nominee = await storage.createNominee(data);
      res.json(nominee);
    } catch (error) {
      res.status(400).json({ error: "Invalid nominee data" });
    }
  });

  app.put("/api/nominees/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const data = insertNomineeSchema.partial().parse(req.body);
      const nominee = await storage.updateNominee(id, data as Partial<Nominee>);
      if (!nominee) {
        return res.status(404).json({ error: "Nominee not found" });
      }
      res.json(nominee);
    } catch (error) {
      res.status(400).json({ error: "Invalid nominee data" });
    }
  });

  app.delete("/api/nominees/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteNominee(id);
    res.json({ success: true });
  });

  // Creatives
  app.get("/api/creatives", async (req, res) => {
    const creatives = await storage.getCreatives();
    res.json(creatives);
  });

  app.post("/api/creatives", async (req, res) => {
    try {
      const data = insertCreativeSchema.parse(req.body);
      const creative = await storage.createCreative(data);
      res.json(creative);
    } catch (error) {
      res.status(400).json({ error: "Invalid creative data" });
    }
  });

  app.put("/api/creatives/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const data = insertCreativeSchema.partial().parse(req.body);
      const creative = await storage.updateCreative(id, data as Partial<Creative>);
      if (!creative) {
        return res.status(404).json({ error: "Creative not found" });
      }
      res.json(creative);
    } catch (error) {
      res.status(400).json({ error: "Invalid creative data" });
    }
  });

  app.delete("/api/creatives/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteCreative(id);
    res.json({ success: true });
  });

  // Votes
  app.post("/api/votes", async (req, res) => {
    try {
      const data = insertVoteSchema.parse(req.body);
      const clientIp = req.ip || req.connection.remoteAddress || "unknown";
      
      // Check if this IP has already voted this week
      const existingVote = await storage.getVoteByIpAndWeek(clientIp, data.weekDate);
      if (existingVote) {
        return res.status(400).json({ error: "You have already voted this week" });
      }

      const vote = await storage.createVote({ ...data, ipAddress: clientIp });
      
      // Update nominee vote count
      const nominee = await storage.getNominee(data.nomineeId);
      if (nominee) {
        await storage.updateNominee(data.nomineeId, { 
          votes: (nominee.votes || 0) + 1 
        });
      }
      
      res.json(vote);
    } catch (error) {
      res.status(400).json({ error: "Invalid vote data" });
    }
  });

  app.get("/api/votes/check/:weekDate", async (req, res) => {
    const weekDate = req.params.weekDate;
    const clientIp = req.ip || req.connection.remoteAddress || "unknown";
    
    const existingVote = await storage.getVoteByIpAndWeek(clientIp, weekDate);
    res.json({ hasVoted: !!existingVote });
  });

  const httpServer = createServer(app);
  return httpServer;
}
