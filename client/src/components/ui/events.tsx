import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, MapPin, User, Plus, Search, Filter, Clock, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertEventSchema, type Event } from "@shared/schema";
import { z } from "zod";

const eventFormSchema = insertEventSchema.extend({
  capacity: z.number().optional(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["/api/events"],
  });

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      type: "",
      date: "",
      time: "",
      location: "",
      description: "",
      contact: "",
      price: "Free",
      capacity: undefined,
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const response = await apiRequest("POST", "/api/events", data);
      return response.json();
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "Event created successfully!",
        description: "Your event has been added to the listings.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create event",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EventFormData) => {
    createEventMutation.mutate(data);
  };

  const filteredEvents = events.filter((event: Event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    const colors = {
      music: "bg-primary/20 text-primary",
      art: "bg-secondary/20 text-secondary",
      photography: "bg-accent/20 text-accent",
      fashion: "bg-purple-100 text-purple-800",
      workshop: "bg-green-100 text-green-800",
      "open-mic": "bg-orange-100 text-orange-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <section id="events" className="py-16 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-poppins mb-4 text-gray-800">Upcoming Events</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover exciting creative events in your area and share your own events with the community.
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48 rounded-xl">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Event Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Event Types</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="open-mic">Open Mic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No events found matching your criteria.</p>
            </div>
          ) : (
            filteredEvents.map((event: Event) => (
              <Card key={event.id} className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6">
                  <img 
                    src={event.type === 'music' 
                      ? "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200"
                      : event.type === 'art'
                      ? "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200"
                      : "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200"
                    } 
                    alt={`${event.type} event`} 
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                  
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                    <span className="text-gray-500 text-sm flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {event.price}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.date} - {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Contact: {event.contact}
                    </div>
                    {event.capacity && (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Capacity: {event.capacity}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Add Event Form */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">Add Your Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    {...form.register("title")}
                    placeholder="Enter event title"
                    className="rounded-xl"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Event Type</Label>
                  <Select onValueChange={(value) => form.setValue("type", value)}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="art">Art</SelectItem>
                      <SelectItem value="photography">Photography</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="open-mic">Open Mic</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.type && (
                    <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    {...form.register("date")}
                    className="rounded-xl"
                  />
                  {form.formState.errors.date && (
                    <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    {...form.register("time")}
                    className="rounded-xl"
                  />
                  {form.formState.errors.time && (
                    <p className="text-sm text-red-500">{form.formState.errors.time.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...form.register("location")}
                    placeholder="Enter location"
                    className="rounded-xl"
                  />
                  {form.formState.errors.location && (
                    <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Info</Label>
                  <Input
                    id="contact"
                    {...form.register("contact")}
                    placeholder="Email or phone number"
                    className="rounded-xl"
                  />
                  {form.formState.errors.contact && (
                    <p className="text-sm text-red-500">{form.formState.errors.contact.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Ticket Price</Label>
                  <Input
                    id="price"
                    {...form.register("price")}
                    placeholder="e.g., Free, P50, P100"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    {...form.register("capacity", { valueAsNumber: true })}
                    placeholder="Maximum attendees"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Describe your event..."
                  rows={4}
                  className="rounded-xl"
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={createEventMutation.isPending}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                {createEventMutation.isPending ? (
                  "Adding Event..."
                ) : (
                  <>
                    <Plus className="mr-2" size={20} />
                    Add Event
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
