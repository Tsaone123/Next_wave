import { 
  users, type User, type InsertUser,
  playlists, type Playlist, type InsertPlaylist,
  events, type Event, type InsertEvent,
  directoryPlaylists, type DirectoryPlaylist, type InsertDirectoryPlaylist,
  artistOfWeek, type ArtistOfWeek, type InsertArtistOfWeek,
  nominees, type Nominee, type InsertNominee,
  creatives, type Creative, type InsertCreative,
  votes, type Vote, type InsertVote
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Playlists
  getPlaylists(): Promise<Playlist[]>;
  getPlaylist(id: number): Promise<Playlist | undefined>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  deletePlaylist(id: number): Promise<void>;
  
  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<Event>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<void>;
  
  // Directory Playlists
  getDirectoryPlaylists(): Promise<DirectoryPlaylist[]>;
  getDirectoryPlaylist(id: number): Promise<DirectoryPlaylist | undefined>;
  createDirectoryPlaylist(playlist: InsertDirectoryPlaylist): Promise<DirectoryPlaylist>;
  updateDirectoryPlaylist(id: number, playlist: Partial<DirectoryPlaylist>): Promise<DirectoryPlaylist | undefined>;
  deleteDirectoryPlaylist(id: number): Promise<void>;
  
  // Artist of Week
  getArtistOfWeek(): Promise<ArtistOfWeek | undefined>;
  createArtistOfWeek(artist: InsertArtistOfWeek): Promise<ArtistOfWeek>;
  updateArtistOfWeek(id: number, artist: Partial<ArtistOfWeek>): Promise<ArtistOfWeek | undefined>;
  
  // Nominees
  getNominees(): Promise<Nominee[]>;
  getNominee(id: number): Promise<Nominee | undefined>;
  createNominee(nominee: InsertNominee): Promise<Nominee>;
  updateNominee(id: number, nominee: Partial<Nominee>): Promise<Nominee | undefined>;
  deleteNominee(id: number): Promise<void>;
  
  // Creatives
  getCreatives(): Promise<Creative[]>;
  getCreative(id: number): Promise<Creative | undefined>;
  createCreative(creative: InsertCreative): Promise<Creative>;
  updateCreative(id: number, creative: Partial<Creative>): Promise<Creative | undefined>;
  deleteCreative(id: number): Promise<void>;
  
  // Votes
  getVotes(): Promise<Vote[]>;
  getVoteByIpAndWeek(ipAddress: string, weekDate: string): Promise<Vote | undefined>;
  createVote(vote: InsertVote): Promise<Vote>;
  getVotesByNominee(nomineeId: number): Promise<Vote[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private playlists: Map<number, Playlist> = new Map();
  private events: Map<number, Event> = new Map();
  private directoryPlaylists: Map<number, DirectoryPlaylist> = new Map();
  private artistOfWeek: Map<number, ArtistOfWeek> = new Map();
  private nominees: Map<number, Nominee> = new Map();
  private creatives: Map<number, Creative> = new Map();
  private votes: Map<number, Vote> = new Map();
  
  private currentUserId = 1;
  private currentPlaylistId = 1;
  private currentEventId = 1;
  private currentDirectoryPlaylistId = 1;
  private currentArtistId = 1;
  private currentNomineeId = 1;
  private currentCreativeId = 1;
  private currentVoteId = 1;

  constructor() {
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample directory playlists
    const sampleDirectoryPlaylists = [
      {
        name: "Gabs Street Vibes",
        genre: "hip-hop",
        description: "A mix of underground hip-hop hits from Gaborone streets",
        songs: ["Mo Faya - Street Dreams", "Kast - Botswana Anthem", "Scar - Underground King"],
        externalLink: "https://youtube.com/playlist?list=sample1",
        isFeatured: true
      },
      {
        name: "Afro Fusion Collection",
        genre: "afrobeat",
        description: "Contemporary African sounds with modern production",
        songs: ["Vee Mampeezy - Dumalana", "ATI - Pelo Ya Rona", "Charma Gal - Nga Nga"],
        externalLink: "https://youtube.com/playlist?list=sample2",
        isFeatured: false
      },
      {
        name: "Smooth Jazz Nights",
        genre: "jazz",
        description: "Mellow jazz selections perfect for evening relaxation",
        songs: ["Jazz Invitation - Moonlight", "Tshepo Tshola - Ho Lokile", "Kgaogelo - Sunset Dreams"],
        externalLink: "https://youtube.com/playlist?list=sample3",
        isFeatured: false
      }
    ];

    sampleDirectoryPlaylists.forEach(playlist => {
      this.createDirectoryPlaylist(playlist);
    });

    // Sample artist of the week
    this.createArtistOfWeek({
      name: "Kgosi Beats",
      bio: "A rising star in the Botswana music scene, Kgosi Beats combines traditional Setswana rhythms with modern hip-hop production. Based in Gaborone, he's known for his conscious lyrics and innovative sound that bridges generations.",
      photoUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
      socialLinks: {
        instagram: "https://instagram.com/kgosibeats",
        youtube: "https://youtube.com/kgosibeats",
        soundcloud: "https://soundcloud.com/kgosibeats"
      },
      interview: "Q: What inspired you to start making music?\nA: Growing up in Gaborone, I was surrounded by the sounds of traditional Setswana music from my grandmother and modern hip-hop from my peers. I realized that these two worlds didn't have to be separate - they could complement each other beautifully.\n\nQ: How do you incorporate traditional elements into your modern sound?\nA: I sample traditional instruments like the segaba and lekolilo, but I also study the rhythmic patterns and storytelling techniques of our ancestors. It's not just about adding traditional sounds; it's about understanding the philosophy behind our music.\n\nQ: What message do you hope to convey through your music?\nA: I want young Batswana to be proud of who they are and where they come from. We don't need to copy foreign styles to be relevant - we have our own rich culture that's worth celebrating.\n\nQ: What's next for Kgosi Beats?\nA: I'm working on my debut album 'Morafe' which will be released next year. I'm also planning to collaborate with other local artists and maybe even some international acts who appreciate authentic African sounds.",
      weekDate: "2024-12-09"
    });

    // Sample nominees
    const sampleNominees = [
      {
        name: "Naledi Soul",
        bio: "R&B singer-songwriter from Maun, known for her soulful voice and heartfelt lyrics about love and identity.",
        photoUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        songs: ["Setswana Soul", "Pelo Ya Me", "Maun Nights"],
        votes: 247,
        weekDate: "2024-12-09"
      },
      {
        name: "Thabo Flows",
        bio: "Hip-hop artist from Francistown, mixing English and Setswana in his conscious rap about social issues.",
        photoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        songs: ["Francistown Story", "Rona Re Batswana", "Change Coming"],
        votes: 189,
        weekDate: "2024-12-09"
      },
      {
        name: "Kgomo Traditional",
        bio: "Traditional music artist preserving Setswana cultural heritage through authentic instrumentation and vocals.",
        photoUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        songs: ["Segaba Dreams", "Ancestors' Voice", "Pula Chant"],
        votes: 156,
        weekDate: "2024-12-09"
      }
    ];

    sampleNominees.forEach(nominee => {
      this.createNominee(nominee);
    });

    // Sample creatives
    const sampleCreatives = [
      {
        name: "Tshiamo Lens",
        category: "photographer",
        location: "francistown",
        bio: "Specializing in portraits and event photography. Capturing authentic moments that tell your story.",
        contact: "tshiamo@email.com",
        socialLinks: {
          instagram: "https://instagram.com/tshiamolens",
          portfolio: "https://tshiamolens.com"
        },
        sampleImages: ["sample1.jpg", "sample2.jpg", "sample3.jpg"],
        isVerified: true,
        isFeatured: false
      },
      {
        name: "Kgosi Designs",
        category: "designer",
        location: "gaborone",
        bio: "Brand identity and digital design specialist. Creating visual solutions that make your brand stand out.",
        contact: "+267 7xxx xxxx",
        socialLinks: {
          portfolio: "https://kgosidesigns.com",
          other: "https://behance.net/kgosidesigns"
        },
        sampleImages: ["design1.jpg", "design2.jpg", "design3.jpg"],
        isVerified: false,
        isFeatured: true
      },
      {
        name: "Nomsa Styles",
        category: "hairstylist",
        location: "maun",
        bio: "Natural hair specialist and braiding expert. Creating beautiful, healthy styles that celebrate your natural beauty.",
        contact: "+267 7xxx xxxx",
        socialLinks: {
          instagram: "https://instagram.com/nomsastyles",
          other: "https://facebook.com/nomsastyles"
        },
        sampleImages: ["hair1.jpg", "hair2.jpg", "hair3.jpg"],
        isVerified: false,
        isFeatured: false
      }
    ];

    sampleCreatives.forEach(creative => {
      this.createCreative(creative);
    });

    // Sample events
    const sampleEvents = [
      {
        title: "Underground Beats Showcase",
        type: "music",
        date: "2024-12-15",
        time: "19:00",
        location: "Cultural Center, Gaborone",
        description: "Featuring local hip-hop and afrobeat artists",
        contact: "events@nextwave.bw",
        price: "Free",
        capacity: 200
      },
      {
        title: "Creative Canvas Workshop",
        type: "art",
        date: "2024-12-20",
        time: "14:00",
        location: "Art Hub, Francistown",
        description: "Learn painting techniques from local artists",
        contact: "+267 7xxx xxxx",
        price: "P50",
        capacity: 30
      },
      {
        title: "Portrait Photography Masterclass",
        type: "photography",
        date: "2024-12-22",
        time: "10:00",
        location: "Studio 24, Maun",
        description: "Professional techniques for stunning portraits",
        contact: "studio24@email.com",
        price: "P100",
        capacity: 15
      }
    ];

    sampleEvents.forEach(event => {
      this.createEvent(event);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Playlist methods
  async getPlaylists(): Promise<Playlist[]> {
    return Array.from(this.playlists.values());
  }

  async getPlaylist(id: number): Promise<Playlist | undefined> {
    return this.playlists.get(id);
  }

  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const id = this.currentPlaylistId++;
    const playlist: Playlist = { 
      ...insertPlaylist, 
      id,
      songs: insertPlaylist.songs as string[],
      isPublic: insertPlaylist.isPublic ?? false
    };
    this.playlists.set(id, playlist);
    return playlist;
  }

  async deletePlaylist(id: number): Promise<void> {
    this.playlists.delete(id);
  }

  // Event methods
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentEventId++;
    const event: Event = { 
      ...insertEvent, 
      id,
      price: insertEvent.price ?? null,
      capacity: insertEvent.capacity ?? null
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, updateEvent: Partial<Event>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    const updatedEvent = { ...event, ...updateEvent };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<void> {
    this.events.delete(id);
  }

  // Directory Playlist methods
  async getDirectoryPlaylists(): Promise<DirectoryPlaylist[]> {
    return Array.from(this.directoryPlaylists.values());
  }

  async getDirectoryPlaylist(id: number): Promise<DirectoryPlaylist | undefined> {
    return this.directoryPlaylists.get(id);
  }

  async createDirectoryPlaylist(insertPlaylist: InsertDirectoryPlaylist): Promise<DirectoryPlaylist> {
    const id = this.currentDirectoryPlaylistId++;
    const playlist: DirectoryPlaylist = { 
      ...insertPlaylist, 
      id,
      songs: insertPlaylist.songs as string[],
      externalLink: insertPlaylist.externalLink ?? null,
      isFeatured: insertPlaylist.isFeatured ?? null
    };
    this.directoryPlaylists.set(id, playlist);
    return playlist;
  }

  async updateDirectoryPlaylist(id: number, updatePlaylist: Partial<DirectoryPlaylist>): Promise<DirectoryPlaylist | undefined> {
    const playlist = this.directoryPlaylists.get(id);
    if (!playlist) return undefined;
    const updatedPlaylist = { ...playlist, ...updatePlaylist };
    this.directoryPlaylists.set(id, updatedPlaylist);
    return updatedPlaylist;
  }

  async deleteDirectoryPlaylist(id: number): Promise<void> {
    this.directoryPlaylists.delete(id);
  }

  // Artist of Week methods
  async getArtistOfWeek(): Promise<ArtistOfWeek | undefined> {
    return Array.from(this.artistOfWeek.values())[0];
  }

  async createArtistOfWeek(insertArtist: InsertArtistOfWeek): Promise<ArtistOfWeek> {
    const id = this.currentArtistId++;
    const artist: ArtistOfWeek = { 
      ...insertArtist, 
      id,
      socialLinks: insertArtist.socialLinks as { instagram?: string; youtube?: string; soundcloud?: string; }
    };
    this.artistOfWeek.clear(); // Only one artist at a time
    this.artistOfWeek.set(id, artist);
    return artist;
  }

  async updateArtistOfWeek(id: number, updateArtist: Partial<ArtistOfWeek>): Promise<ArtistOfWeek | undefined> {
    const artist = this.artistOfWeek.get(id);
    if (!artist) return undefined;
    const updatedArtist = { ...artist, ...updateArtist };
    this.artistOfWeek.set(id, updatedArtist);
    return updatedArtist;
  }

  // Nominee methods
  async getNominees(): Promise<Nominee[]> {
    return Array.from(this.nominees.values());
  }

  async getNominee(id: number): Promise<Nominee | undefined> {
    return this.nominees.get(id);
  }

  async createNominee(insertNominee: InsertNominee): Promise<Nominee> {
    const id = this.currentNomineeId++;
    const nominee: Nominee = { 
      ...insertNominee, 
      id,
      songs: insertNominee.songs as string[],
      votes: insertNominee.votes ?? null
    };
    this.nominees.set(id, nominee);
    return nominee;
  }

  async updateNominee(id: number, updateNominee: Partial<Nominee>): Promise<Nominee | undefined> {
    const nominee = this.nominees.get(id);
    if (!nominee) return undefined;
    const updatedNominee = { ...nominee, ...updateNominee };
    this.nominees.set(id, updatedNominee);
    return updatedNominee;
  }

  async deleteNominee(id: number): Promise<void> {
    this.nominees.delete(id);
  }

  // Creative methods
  async getCreatives(): Promise<Creative[]> {
    return Array.from(this.creatives.values());
  }

  async getCreative(id: number): Promise<Creative | undefined> {
    return this.creatives.get(id);
  }

  async createCreative(insertCreative: InsertCreative): Promise<Creative> {
    const id = this.currentCreativeId++;
    const creative: Creative = { 
      ...insertCreative, 
      id,
      isFeatured: insertCreative.isFeatured ?? null,
      isVerified: insertCreative.isVerified ?? null,
      sampleImages: insertCreative.sampleImages as string[],
      socialLinks: insertCreative.socialLinks as { instagram?: string; portfolio?: string; other?: string; }
    };
    this.creatives.set(id, creative);
    return creative;
  }

  async updateCreative(id: number, updateCreative: Partial<Creative>): Promise<Creative | undefined> {
    const creative = this.creatives.get(id);
    if (!creative) return undefined;
    const updatedCreative = { ...creative, ...updateCreative };
    this.creatives.set(id, updatedCreative);
    return updatedCreative;
  }

  async deleteCreative(id: number): Promise<void> {
    this.creatives.delete(id);
  }

  // Vote methods
  async getVotes(): Promise<Vote[]> {
    return Array.from(this.votes.values());
  }

  async getVoteByIpAndWeek(ipAddress: string, weekDate: string): Promise<Vote | undefined> {
    return Array.from(this.votes.values()).find(vote => 
      vote.ipAddress === ipAddress && vote.weekDate === weekDate
    );
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    const id = this.currentVoteId++;
    const vote: Vote = { ...insertVote, id };
    this.votes.set(id, vote);
    return vote;
  }

  async getVotesByNominee(nomineeId: number): Promise<Vote[]> {
    return Array.from(this.votes.values()).filter(vote => vote.nomineeId === nomineeId);
  }
}

export const storage = new MemStorage();
