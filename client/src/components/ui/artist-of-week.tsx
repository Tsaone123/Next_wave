import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Instagram, Youtube, Music as MusicIcon, Newspaper, Shield, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertArtistOfWeekSchema, type ArtistOfWeek } from "@shared/schema";
import { z } from "zod";

const artistFormSchema = insertArtistOfWeekSchema.extend({
  instagram: z.string().url().optional().or(z.literal("")),
  youtube: z.string().url().optional().or(z.literal("")),
  soundcloud: z.string().url().optional().or(z.literal("")),
});

type ArtistFormData = z.infer<typeof artistFormSchema>;

interface ArtistOfWeekProps {
  isAdmin: boolean;
}

export default function ArtistOfWeek({ isAdmin }: ArtistOfWeekProps) {
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: artist, isLoading } = useQuery({
    queryKey: ["/api/artist-of-week"],
  });

  const form = useForm<ArtistFormData>({
    resolver: zodResolver(artistFormSchema),
    defaultValues: {
      name: "",
      bio: "",
      photoUrl: "",
      socialLinks: {},
      interview: "",
      weekDate: "",
      instagram: "",
      youtube: "",
      soundcloud: "",
    },
  });

  const createArtistMutation = useMutation({
    mutationFn: async (data: ArtistFormData) => {
      const { instagram, youtube, soundcloud, ...artistData } = data;
      const socialLinks = {
        ...(instagram && { instagram }),
        ...(youtube && { youtube }),
        ...(soundcloud && { soundcloud }),
      };
      
      const response = await apiRequest("POST", "/api/artist-of-week", {
        ...artistData,
        socialLinks,
      });
      return response.json();
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "Artist of the Week updated!",
        description: "The featured artist has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/artist-of-week"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update artist",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ArtistFormData) => {
    createArtistMutation.mutate(data);
  };

  const formatInterview = (interview: string) => {
    return interview.split('\n\n').map((paragraph, index) => (
      <div key={index} className="mb-6">
        {paragraph.startsWith('Q:') ? (
          <div>
            <h4 className="text-xl font-semibold text-primary mb-3">{paragraph}</h4>
          </div>
        ) : paragraph.startsWith('A:') ? (
          <p className="text-gray-700 leading-relaxed">{paragraph}</p>
        ) : (
          <p className="text-gray-700 leading-relaxed">{paragraph}</p>
        )}
      </div>
    ));
  };

  return (
    <section id="artist-week" className="py-16 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-poppins mb-4 text-gray-800">Artist of the Week</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Celebrating exceptional local talent. Get to know this week's featured artist.
          </p>
        </div>

        {/* Artist Feature Card */}
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading artist...</p>
          </div>
        ) : artist ? (
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <img 
                    src={artist.photoUrl} 
                    alt={artist.name} 
                    className="w-full h-80 object-cover rounded-2xl shadow-lg"
                  />
                </div>
                <div className="md:w-2/3">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-3xl font-bold text-gray-800">{artist.name}</h3>
                    <Badge className="bg-gradient-to-r from-accent to-primary text-white">
                      <Calendar className="h-3 w-3 mr-1" />
                      Week of {new Date(artist.weekDate).toLocaleDateString()}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    {artist.bio}
                  </p>
                  
                  {/* Sample Track */}
                  <div className="bg-gray-100 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Featured Track: "Morafe"</h4>
                    <audio controls className="w-full">
                      <source src="#" type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>

                  {/* Social Links */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    {artist.socialLinks.instagram && (
                      <Button
                        onClick={() => window.open(artist.socialLinks.instagram, '_blank')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
                      >
                        <Instagram className="mr-2" size={16} />
                        Instagram
                      </Button>
                    )}
                    {artist.socialLinks.youtube && (
                      <Button
                        onClick={() => window.open(artist.socialLinks.youtube, '_blank')}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                      >
                        <Youtube className="mr-2" size={16} />
                        YouTube
                      </Button>
                    )}
                    {artist.socialLinks.soundcloud && (
                      <Button
                        onClick={() => window.open(artist.socialLinks.soundcloud, '_blank')}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl"
                      >
                        <MusicIcon className="mr-2" size={16} />
                        SoundCloud
                      </Button>
                    )}
                  </div>

                  <Dialog open={isInterviewOpen} onOpenChange={setIsInterviewOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                        <Newspaper className="mr-2" size={20} />
                        Read Interview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-800">
                          Interview with {artist.name}
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="mt-6">
                        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 mb-6">
                          <p className="text-lg font-semibold text-gray-800 mb-2">
                            "Music is the universal language that connects us all. Through my art, I hope to bridge the gap between our traditional roots and modern expression."
                          </p>
                          <p className="text-gray-600">- {artist.name}</p>
                        </div>

                        <div className="prose prose-lg max-w-none">
                          {formatInterview(artist.interview)}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No artist featured this week.</p>
          </div>
        )}

        {/* Admin Upload Panel */}
        {isAdmin && (
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                <Shield className="mr-2 text-primary" size={24} />
                Admin: Update Artist of the Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Artist Name</Label>
                    <Input
                      id="name"
                      {...form.register("name")}
                      placeholder="Enter artist name"
                      className="rounded-xl"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="photoUrl">Photo URL</Label>
                    <Input
                      id="photoUrl"
                      type="url"
                      {...form.register("photoUrl")}
                      placeholder="https://example.com/photo.jpg"
                      className="rounded-xl"
                    />
                    {form.formState.errors.photoUrl && (
                      <p className="text-sm text-red-500">{form.formState.errors.photoUrl.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    {...form.register("bio")}
                    placeholder="Write a brief bio about the artist..."
                    rows={4}
                    className="rounded-xl"
                  />
                  {form.formState.errors.bio && (
                    <p className="text-sm text-red-500">{form.formState.errors.bio.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weekDate">Week Date</Label>
                  <Input
                    id="weekDate"
                    type="date"
                    {...form.register("weekDate")}
                    className="rounded-xl"
                  />
                  {form.formState.errors.weekDate && (
                    <p className="text-sm text-red-500">{form.formState.errors.weekDate.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      type="url"
                      {...form.register("instagram")}
                      placeholder="https://instagram.com/username"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      type="url"
                      {...form.register("youtube")}
                      placeholder="https://youtube.com/channel"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soundcloud">SoundCloud</Label>
                    <Input
                      id="soundcloud"
                      type="url"
                      {...form.register("soundcloud")}
                      placeholder="https://soundcloud.com/username"
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interview">Interview Content</Label>
                  <Textarea
                    id="interview"
                    {...form.register("interview")}
                    placeholder="Q: What inspires your music?&#10;A: My grandmother's stories...&#10;&#10;Q: What's next for you?&#10;A: Working on my debut album..."
                    rows={8}
                    className="rounded-xl"
                  />
                  {form.formState.errors.interview && (
                    <p className="text-sm text-red-500">{form.formState.errors.interview.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={createArtistMutation.isPending}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  {createArtistMutation.isPending ? (
                    "Updating Artist..."
                  ) : (
                    <>
                      <Star className="mr-2" size={20} />
                      Update Artist of the Week
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
