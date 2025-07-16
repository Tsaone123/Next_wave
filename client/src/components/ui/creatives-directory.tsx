import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Filter, UserPlus, Mail, Instagram, Globe, MapPin, Star, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertCreativeSchema, type Creative } from "@shared/schema";
import { z } from "zod";

const creativeFormSchema = insertCreativeSchema.extend({
  instagram: z.string().optional(),
  portfolio: z.string().optional(),
  other: z.string().optional(),
});

type CreativeFormData = z.infer<typeof creativeFormSchema>;

export default function CreativesDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: creatives = [], isLoading } = useQuery({
    queryKey: ["/api/creatives"],
  });

  const form = useForm<CreativeFormData>({
    resolver: zodResolver(creativeFormSchema),
    defaultValues: {
      name: "",
      category: "",
      location: "",
      bio: "",
      contact: "",
      socialLinks: {},
      sampleImages: [],
      isVerified: false,
      isFeatured: false,
      instagram: "",
      portfolio: "",
      other: "",
    },
  });

  const createCreativeMutation = useMutation({
    mutationFn: async (data: CreativeFormData) => {
      const { instagram, portfolio, other, ...creativeData } = data;
      const socialLinks = {
        ...(instagram && { instagram }),
        ...(portfolio && { portfolio }),
        ...(other && { other }),
      };
      
      // For demo purposes, we'll use placeholder images
      const sampleImages = ["sample1.jpg", "sample2.jpg", "sample3.jpg"];
      
      const response = await apiRequest("POST", "/api/creatives", {
        ...creativeData,
        socialLinks,
        sampleImages,
      });
      return response.json();
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "Profile submitted successfully!",
        description: "Your creative profile has been submitted and will be reviewed before being added to the directory.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/creatives"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreativeFormData) => {
    createCreativeMutation.mutate(data);
  };

  const filteredCreatives = creatives.filter((creative: Creative) => {
    const matchesSearch = creative.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creative.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || filterCategory === 'all' || creative.category === filterCategory;
    const matchesLocation = !filterLocation || filterLocation === 'all' || creative.location === filterLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      photographer: "bg-primary/20 text-primary",
      designer: "bg-secondary/20 text-secondary",
      hairstylist: "bg-accent/20 text-accent",
      stylist: "bg-purple-100 text-purple-800",
      makeup: "bg-pink-100 text-pink-800",
      videographer: "bg-green-100 text-green-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getBadgeIcon = (creative: Creative) => {
    if (creative.isVerified) return <Award className="h-3 w-3 mr-1" />;
    if (creative.isFeatured) return <Star className="h-3 w-3 mr-1" />;
    return <Zap className="h-3 w-3 mr-1" />;
  };

  const getBadgeColor = (creative: Creative) => {
    if (creative.isVerified) return "bg-green-100 text-green-800";
    if (creative.isFeatured) return "bg-yellow-100 text-yellow-800";
    return "bg-purple-100 text-purple-800";
  };

  const getBadgeText = (creative: Creative) => {
    if (creative.isVerified) return "Verified";
    if (creative.isFeatured) return "Featured";
    return "Top Rated";
  };

  const getProfileImage = (category: string) => {
    const images = {
      photographer: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      designer: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      hairstylist: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      stylist: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      makeup: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      videographer: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    };
    return images[category as keyof typeof images] || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300";
  };

  const renderSampleWork = (category: string) => {
    if (category === "photographer") {
      return (
        <div className="grid grid-cols-3 gap-2">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150" alt="Photography sample" className="w-full h-16 object-cover rounded-lg" />
          <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150" alt="Photography sample" className="w-full h-16 object-cover rounded-lg" />
          <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150" alt="Photography sample" className="w-full h-16 object-cover rounded-lg" />
        </div>
      );
    } else if (category === "designer") {
      return (
        <div className="grid grid-cols-3 gap-2">
          <div className="w-full h-16 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">LOGO</span>
          </div>
          <div className="w-full h-16 bg-gradient-to-r from-secondary to-accent rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">BRAND</span>
          </div>
          <div className="w-full h-16 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">DESIGN</span>
          </div>
        </div>
      );
    } else if (category === "hairstylist") {
      return (
        <div className="grid grid-cols-3 gap-2">
          <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150" alt="Hairstyling sample" className="w-full h-16 object-cover rounded-lg" />
          <img src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150" alt="Hairstyling sample" className="w-full h-16 object-cover rounded-lg" />
          <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150" alt="Hairstyling sample" className="w-full h-16 object-cover rounded-lg" />
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-3 gap-2">
          <div className="w-full h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-xs">Sample 1</span>
          </div>
          <div className="w-full h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-xs">Sample 2</span>
          </div>
          <div className="w-full h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-xs">Sample 3</span>
          </div>
        </div>
      );
    }
  };

  return (
    <section id="creatives" className="py-16 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-poppins mb-4 text-gray-800">Creatives Directory</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover talented photographers, designers, hairstylists, and more. Connect with creatives in your area.
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-48 rounded-xl">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="photographer">Photographer</SelectItem>
                  <SelectItem value="designer">Graphic Designer</SelectItem>
                  <SelectItem value="hairstylist">Hairstylist</SelectItem>
                  <SelectItem value="stylist">Fashion Stylist</SelectItem>
                  <SelectItem value="makeup">Makeup Artist</SelectItem>
                  <SelectItem value="videographer">Videographer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="w-full md:w-48 rounded-xl">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="gaborone">Gaborone</SelectItem>
                  <SelectItem value="francistown">Francistown</SelectItem>
                  <SelectItem value="maun">Maun</SelectItem>
                  <SelectItem value="kasane">Kasane</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Creatives Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Loading creatives...</p>
            </div>
          ) : filteredCreatives.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No creatives found matching your criteria.</p>
            </div>
          ) : (
            filteredCreatives.map((creative: Creative) => (
              <Card key={creative.id} className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6">
                  <img 
                    src={getProfileImage(creative.category)} 
                    alt={creative.name} 
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                  
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{creative.name}</h3>
                    <Badge className={getBadgeColor(creative)}>
                      {getBadgeIcon(creative)}
                      {getBadgeText(creative)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getCategoryColor(creative.category)}>
                      {creative.category}
                    </Badge>
                    <span className="text-gray-500 text-sm capitalize">{creative.location}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{creative.bio}</p>
                  
                  {/* Sample Work */}
                  <div className="mb-4">
                    {renderSampleWork(creative.category)}
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    {creative.socialLinks.instagram && (
                      <Button
                        size="sm"
                        onClick={() => window.open(creative.socialLinks.instagram, '_blank')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        <Instagram className="mr-1" size={12} />
                        Instagram
                      </Button>
                    )}
                    {creative.socialLinks.portfolio && (
                      <Button
                        size="sm"
                        onClick={() => window.open(creative.socialLinks.portfolio, '_blank')}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        <Globe className="mr-1" size={12} />
                        Portfolio
                      </Button>
                    )}
                    {creative.socialLinks.other && (
                      <Button
                        size="sm"
                        onClick={() => window.open(creative.socialLinks.other, '_blank')}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        <Globe className="mr-1" size={12} />
                        Other
                      </Button>
                    )}
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                    <Mail className="mr-2" size={16} />
                    Contact
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Join Directory Form */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 text-center">Join Our Creative Community</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name / Stage Name</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Enter your name"
                    className="rounded-xl"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => form.setValue("category", value)}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="photographer">Photographer</SelectItem>
                      <SelectItem value="designer">Graphic Designer</SelectItem>
                      <SelectItem value="hairstylist">Hairstylist</SelectItem>
                      <SelectItem value="stylist">Fashion Stylist</SelectItem>
                      <SelectItem value="makeup">Makeup Artist</SelectItem>
                      <SelectItem value="videographer">Videographer</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && (
                    <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select onValueChange={(value) => form.setValue("location", value)}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gaborone">Gaborone</SelectItem>
                      <SelectItem value="francistown">Francistown</SelectItem>
                      <SelectItem value="maun">Maun</SelectItem>
                      <SelectItem value="kasane">Kasane</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.location && (
                    <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Info</Label>
                  <Input
                    id="contact"
                    {...form.register("contact")}
                    placeholder="Email or WhatsApp"
                    className="rounded-xl"
                  />
                  {form.formState.errors.contact && (
                    <p className="text-sm text-red-500">{form.formState.errors.contact.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio / Description</Label>
                <Textarea
                  id="bio"
                  {...form.register("bio")}
                  placeholder="Tell us about your creative work and specialties..."
                  rows={4}
                  className="rounded-xl"
                />
                {form.formState.errors.bio && (
                  <p className="text-sm text-red-500">{form.formState.errors.bio.message}</p>
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
                  <Label htmlFor="portfolio">Portfolio/Website</Label>
                  <Input
                    id="portfolio"
                    type="url"
                    {...form.register("portfolio")}
                    placeholder="https://yourportfolio.com"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="other">Other Link</Label>
                  <Input
                    id="other"
                    type="url"
                    {...form.register("other")}
                    placeholder="Facebook, Behance, etc."
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sampleImages">Sample Work Images</Label>
                <Input
                  id="sampleImages"
                  type="file"
                  accept="image/*"
                  multiple
                  className="rounded-xl"
                />
                <p className="text-sm text-gray-500">Upload 2-3 images of your best work</p>
              </div>

              <Button
                type="submit"
                disabled={createCreativeMutation.isPending}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                {createCreativeMutation.isPending ? (
                  "Submitting..."
                ) : (
                  <>
                    <UserPlus className="mr-2" size={20} />
                    Join Directory
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
