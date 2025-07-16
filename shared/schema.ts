import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userName: text("user_name").notNull(),
  songs: json("songs").$type<string[]>().notNull(),
  isPublic: boolean("is_public").default(false),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  contact: text("contact").notNull(),
  price: text("price").default("Free"),
  capacity: integer("capacity"),
});

export const directoryPlaylists = pgTable("directory_playlists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  genre: text("genre").notNull(),
  description: text("description").notNull(),
  songs: json("songs").$type<string[]>().notNull(),
  externalLink: text("external_link"),
  isFeatured: boolean("is_featured").default(false),
});

export const artistOfWeek = pgTable("artist_of_week", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  photoUrl: text("photo_url").notNull(),
  socialLinks: json("social_links").$type<{instagram?: string, youtube?: string, soundcloud?: string}>().notNull(),
  interview: text("interview").notNull(),
  weekDate: text("week_date").notNull(),
});

export const nominees = pgTable("nominees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  photoUrl: text("photo_url").notNull(),
  songs: json("songs").$type<string[]>().notNull(),
  votes: integer("votes").default(0),
  weekDate: text("week_date").notNull(),
});

export const creatives = pgTable("creatives", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  location: text("location").notNull(),
  bio: text("bio").notNull(),
  contact: text("contact").notNull(),
  socialLinks: json("social_links").$type<{instagram?: string, portfolio?: string, other?: string}>().notNull(),
  sampleImages: json("sample_images").$type<string[]>().notNull(),
  isVerified: boolean("is_verified").default(false),
  isFeatured: boolean("is_featured").default(false),
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  nomineeId: integer("nominee_id").notNull(),
  ipAddress: text("ip_address").notNull(),
  weekDate: text("week_date").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertPlaylistSchema = createInsertSchema(playlists).omit({ id: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertDirectoryPlaylistSchema = createInsertSchema(directoryPlaylists).omit({ id: true });
export const insertArtistOfWeekSchema = createInsertSchema(artistOfWeek).omit({ id: true });
export const insertNomineeSchema = createInsertSchema(nominees).omit({ id: true });
export const insertCreativeSchema = createInsertSchema(creatives).omit({ id: true });
export const insertVoteSchema = createInsertSchema(votes).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Playlist = typeof playlists.$inferSelect;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type DirectoryPlaylist = typeof directoryPlaylists.$inferSelect;
export type InsertDirectoryPlaylist = z.infer<typeof insertDirectoryPlaylistSchema>;
export type ArtistOfWeek = typeof artistOfWeek.$inferSelect;
export type InsertArtistOfWeek = z.infer<typeof insertArtistOfWeekSchema>;
export type Nominee = typeof nominees.$inferSelect;
export type InsertNominee = z.infer<typeof insertNomineeSchema>;
export type Creative = typeof creatives.$inferSelect;
export type InsertCreative = z.infer<typeof insertCreativeSchema>;
export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;
