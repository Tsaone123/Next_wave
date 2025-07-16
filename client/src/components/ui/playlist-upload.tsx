import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Music, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertPlaylistSchema } from "@shared/schema";
import { z } from "zod";

const playlistFormSchema = insertPlaylistSchema.extend({
  song1: z.instanceof(File).optional(),
  song2: z.instanceof(File).optional(),
  song3: z.instanceof(File).optional(),
});

type PlaylistFormData = z.infer<typeof playlistFormSchema>;

export default function PlaylistUpload() {
  const [uploadedPlaylist, setUploadedPlaylist] = useState<any>(null);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PlaylistFormData>({
    resolver: zodResolver(playlistFormSchema),
    defaultValues: {
      name: "",
      userName: "",
      songs: [],
      isPublic: false,
    },
  });

  const createPlaylistMutation = useMutation({
    mutationFn: async (data: PlaylistFormData) => {
      const songs: string[] = [];
      const urls: string[] = [];
      
      // Process uploaded files
      [data.song1, data.song2, data.song3].forEach((file, index) => {
        if (file) {
          // Validate MP3 format
          if (!file.type.includes('audio/mpeg')) {
            throw new Error(`Song ${index + 1} must be an MP3 file`);
          }
          songs.push(file.name);
          urls.push(URL.createObjectURL(file));
        }
      });

      if (songs.length === 0) {
        throw new Error("Please upload at least one song");
      }

      const playlistData = {
        name: data.name,
        userName: data.userName,
        songs,
        isPublic: data.isPublic,
      };

      const response = await apiRequest("POST", "/api/playlists", playlistData);
      return { playlist: await response.json(), audioUrls: urls };
    },
    onSuccess: (data) => {
      setUploadedPlaylist(data.playlist);
      setAudioUrls(data.audioUrls);
      form.reset();
      toast({
        title: "Playlist uploaded successfully!",
        description: "Your playlist has been created and is ready to play.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/playlists"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PlaylistFormData) => {
    createPlaylistMutation.mutate(data);
  };

  return (
    <section id="playlist" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-poppins mb-4 text-gray-800">Share Your Playlist</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your best tracks and let the community discover your music. Maximum 3 MP3 files allowed.
          </p>
        </div>

        {/* Upload Instructions */}
        <Alert className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold text-gray-800">Upload Instructions:</p>
              <ul className="text-gray-600 space-y-1">
                <li>• Maximum 3 songs per playlist</li>
                <li>• MP3 format only</li>
                <li>• Each file should be under 10MB</li>
                <li>• Clear audio quality recommended</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>

        {/* Upload Form */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">Create Your Playlist</CardTitle>
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
                  <Label htmlFor="userName">Your Name</Label>
                  <Input
                    id="userName"
                    {...form.register("userName")}
                    placeholder="Enter your name"
                    className="rounded-xl"
                  />
                  {form.formState.errors.userName && (
                    <p className="text-sm text-red-500">{form.formState.errors.userName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Upload Songs (MP3 only)</Label>
                <div className="space-y-3">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept=".mp3,audio/mpeg"
                          {...form.register(`song${num}` as keyof PlaylistFormData)}
                          className="rounded-xl"
                        />
                      </div>
                      <span className="text-sm text-gray-500">Song {num}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={createPlaylistMutation.isPending}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                {createPlaylistMutation.isPending ? (
                  "Uploading..."
                ) : (
                  <>
                    <Upload className="mr-2" size={20} />
                    Upload Playlist
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Playlist Display */}
        {uploadedPlaylist && (
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={24} />
                Your Playlist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800">{uploadedPlaylist.name}</h3>
                <p className="text-gray-600">by {uploadedPlaylist.userName}</p>
              </div>
              <div className="space-y-4">
                {uploadedPlaylist.songs.map((song: string, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <Music className="mr-2 text-primary" size={16} />
                      <h4 className="font-semibold text-gray-800">{index + 1}. {song}</h4>
                    </div>
                    {audioUrls[index] && (
                      <audio controls className="w-full">
                        <source src={audioUrls[index]} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
