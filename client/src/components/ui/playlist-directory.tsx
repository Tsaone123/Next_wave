import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Filter, Play, Shield, Plus, Music, Star, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertDirectoryPlaylistSchema, type DirectoryPlaylist } from "@shared/schema";
import { z } from "zod";

const playlistFormSchema = insertDirectoryPlaylistSchema.extend({
  song1: z.string().min(1, "Song 1 is required"),
  song2: z.string().min(1, "Song 2 is required"),
  song3: z.string().min(1, "Song 3 is required"),
});

type PlaylistFormData = z.infer<typeof playlistFormSchema>;

interface PlaylistDirectoryProps {
  isAdmin: boolean;
}

export default function PlaylistDirectory({ isAdmin }: PlaylistDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: playlists = [], isLoading } = useQuery({
    queryKey: ["/api/directory-playlists"],
  });

  const form = useForm<PlaylistFormData>({
    resolver: zodResolver(playlistFormSchema),
    defaultValues: {
      name: "",
      genre: "",
      description: "",
      songs: [],
      externalLink: "",
      isFeatured: false,
      song1: "",
      song2: "",
      song3: "",
    },
  });

  const createPlaylistMutation = useMutation({
    mutationFn: async (data: PlaylistFormData) => {
      const { song1, song2, song3, ...playlistData } = data;
      const songs = [song1, song2, song3];
      
      const response = await apiRequest("POST", "/api/directory-playlists", {
        ...playlistData,
        songs,
      });
      return response.json();
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "Playlist added successfully!",
        description: "The playlist has been added to the directory.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/directory-playlists"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add playlist",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PlaylistFormData) => {
    createPlaylistMutation.mutate(data);
  };

  const filteredPlaylists = playlists.filter((playlist: DirectoryPlaylist) => {
    const matchesSearch = playlist.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !filterGenre || filterGenre === 'all' || playlist.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  const getGenreColor = (genre: string) => {
    const colors = {
      "hip-hop": "bg-primary/20 text-primary",
      "afrobeat": "bg-secondary/20 text-secondary",
      "jazz": "bg-accent/20 text-accent",
      "rnb": "bg-purple-100 text-purple-800",
      "traditional": "bg-green-100 text-green-800",
    };
    return colors[genre as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getBadgeIcon = (playlist: DirectoryPlaylist) => {
    if (playlist.isFeatured) return <Star className="h-3 w-3 mr-1" />;
    return <Zap className="h-3 w-3 mr-1" />;
  };

  const getBadgeColor = (playlist: DirectoryPlaylist) => {
    if (playlist.isFeatured) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  const getBadgeText = (playlist: DirectoryPlaylist) => {
    if (playlist.isFeatured) return "Featured";
    return "New";
  };

  return (
    <section id="directory" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-poppins mb-4 text-gray-800">Local Playlist Directory</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover curated playlists from local artists and genres. Admin-approved quality music collections.
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search playlists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              <Select value={filterGenre} onValueChange={setFilterGenre}>
                <SelectTrigger className="w-full md:w-48 rounded-xl">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                  <SelectItem value="afrobeat">Afrobeat</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                  <SelectItem value="rnb">R&B</SelectItem>
                  <SelectItem value="traditional">Traditional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Playlist Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Loading playlists...</p>
            </div>
          ) : filteredPlaylists.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No playlists found matching your criteria.</p>
            </div>
          ) : (
            filteredPlaylists.map((playlist: DirectoryPlaylist) => (
              <Card key={playlist.id} className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getGenreColor(playlist.genre)}>
                      {playlist.genre}
                    </Badge>
                    <Badge className={getBadgeColor(playlist)}>
                      {getBadgeIcon(playlist)}
                      {getBadgeText(playlist)}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{playlist.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{playlist.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-700 mb-4">
                    {playlist.songs.map((song, index) => (
                      <div key={index} className="flex items-center">
                        <Music className="h-4 w-4 mr-2 text-primary" />
                        {song}
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => {
                      if (playlist.externalLink) {
                        window.open(playlist.externalLink, '_blank');
                      }
                    }}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    <Play className="mr-2" size={16} />
                    Listen Now
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Admin Upload Panel */}
        {isAdmin && (
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                <Shield className="mr-2 text-primary" size={24} />
                Admin: Add Playlist to Directory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Playlist Name</Label>
                    <Input
                      id="name"
                      {...form.register("name")}
                      placeholder="Enter playlist name"
                      className="rounded-xl"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre</Label>
                    <Select onValueChange={(value) => form.setValue("genre", value)}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select Genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                        <SelectItem value="afrobeat">Afrobeat</SelectItem>
                        <SelectItem value="jazz">Jazz</SelectItem>
                        <SelectItem value="rnb">R&B</SelectItem>
                        <SelectItem value="traditional">Traditional</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.genre && (
                      <p className="text-sm text-red-500">{form.formState.errors.genre.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder="Describe the playlist..."
                    rows={3}
                    className="rounded-xl"
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="song1">Song 1</Label>
                    <Input
                      id="song1"
                      {...form.register("song1")}
                      placeholder="Artist - Song Title"
                      className="rounded-xl"
                    />
                    {form.formState.errors.song1 && (
                      <p className="text-sm text-red-500">{form.formState.errors.song1.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="song2">Song 2</Label>
                    <Input
                      id="song2"
                      {...form.register("song2")}
                      placeholder="Artist - Song Title"
                      className="rounded-xl"
                    />
                    {form.formState.errors.song2 && (
                      <p className="text-sm text-red-500">{form.formState.errors.song2.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="song3">Song 3</Label>
                    <Input
                      id="song3"
                      {...form.register("song3")}
                      placeholder="Artist - Song Title"
                      className="rounded-xl"
                    />
                    {form.formState.errors.song3 && (
                      <p className="text-sm text-red-500">{form.formState.errors.song3.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="externalLink">External Link</Label>
                  <Input
                    id="externalLink"
                    type="url"
                    {...form.register("externalLink")}
                    placeholder="https://youtube.com/playlist?list=..."
                    className="rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={createPlaylistMutation.isPending}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  {createPlaylistMutation.isPending ? (
                    "Adding Playlist..."
                  ) : (
                    <>
                      <Plus className="mr-2" size={20} />
                      Add to Directory
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
