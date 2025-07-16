import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Calendar, Music, Star, Vote } from "lucide-react";

export default function AdminPanel() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white rounded-t-2xl">
          <CardTitle className="text-2xl font-bold flex items-center">
            <Shield className="mr-2" size={24} />
            Admin Control Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="playlists">Playlists</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="artists">Artists</TabsTrigger>
              <TabsTrigger value="voting">Voting</TabsTrigger>
              <TabsTrigger value="creatives">Creatives</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
                  <CardContent className="p-6 text-center">
                    <Music className="mx-auto mb-4 text-primary" size={48} />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">24</h3>
                    <p className="text-gray-600">Total Playlists</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-secondary/10 to-secondary/5">
                  <CardContent className="p-6 text-center">
                    <Calendar className="mx-auto mb-4 text-secondary" size={48} />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">8</h3>
                    <p className="text-gray-600">Upcoming Events</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-accent/10 to-accent/5">
                  <CardContent className="p-6 text-center">
                    <Users className="mx-auto mb-4 text-accent" size={48} />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">156</h3>
                    <p className="text-gray-600">Creatives</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div>
                        <p className="font-semibold">New playlist submitted</p>
                        <p className="text-sm text-gray-600">Gabs Street Vibes by Local Artist</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <div>
                        <p className="font-semibold">Event added</p>
                        <p className="text-sm text-gray-600">Underground Beats Showcase</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <div>
                        <p className="font-semibold">New creative joined</p>
                        <p className="text-sm text-gray-600">Tshiamo Lens - Photographer</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="playlists" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Playlist Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Gabs Street Vibes</h4>
                        <p className="text-sm text-gray-600">Hip-hop • 3 songs</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-primary text-white px-3 py-1 rounded text-sm">Edit</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Afro Fusion Collection</h4>
                        <p className="text-sm text-gray-600">Afrobeat • 3 songs</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-primary text-white px-3 py-1 rounded text-sm">Edit</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Smooth Jazz Nights</h4>
                        <p className="text-sm text-gray-600">Jazz • 3 songs</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-primary text-white px-3 py-1 rounded text-sm">Edit</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Underground Beats Showcase</h4>
                        <p className="text-sm text-gray-600">Dec 15, 2024 • Music • Free</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-primary text-white px-3 py-1 rounded text-sm">Edit</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Creative Canvas Workshop</h4>
                        <p className="text-sm text-gray-600">Dec 20, 2024 • Art • P50</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-primary text-white px-3 py-1 rounded text-sm">Edit</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Portrait Photography Masterclass</h4>
                        <p className="text-sm text-gray-600">Dec 22, 2024 • Photography • P100</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-primary text-white px-3 py-1 rounded text-sm">Edit</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="artists" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Artist of the Week Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                      <div className="flex items-center gap-4">
                        <Star className="text-accent" size={24} />
                        <div>
                          <h4 className="font-semibold">Kgosi Beats</h4>
                          <p className="text-sm text-gray-600">Current Artist of the Week</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-primary text-white px-3 py-1 rounded text-sm">Edit</button>
                        <button className="bg-secondary text-white px-3 py-1 rounded text-sm">Change</button>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-semibold mb-2">Past Artists</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>Naledi Soul</span>
                          <span className="text-sm text-gray-600">Week of Dec 2</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Thabo Flows</span>
                          <span className="text-sm text-gray-600">Week of Nov 25</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Kgomo Traditional</span>
                          <span className="text-sm text-gray-600">Week of Nov 18</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="voting" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Voting Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <Vote className="mx-auto mb-2 text-green-600" size={24} />
                        <h4 className="font-semibold">Naledi Soul</h4>
                        <p className="text-2xl font-bold text-green-600">247</p>
                        <p className="text-sm text-gray-600">votes</p>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg text-center">
                        <Vote className="mx-auto mb-2 text-orange-600" size={24} />
                        <h4 className="font-semibold">Thabo Flows</h4>
                        <p className="text-2xl font-bold text-orange-600">189</p>
                        <p className="text-sm text-gray-600">votes</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <Vote className="mx-auto mb-2 text-blue-600" size={24} />
                        <h4 className="font-semibold">Kgomo Traditional</h4>
                        <p className="text-2xl font-bold text-blue-600">156</p>
                        <p className="text-sm text-gray-600">votes</p>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="font-semibold">Voting Controls</h5>
                        <div className="flex gap-2">
                          <button className="bg-primary text-white px-4 py-2 rounded">Add Nominee</button>
                          <button className="bg-secondary text-white px-4 py-2 rounded">End Voting</button>
                          <button className="bg-accent text-white px-4 py-2 rounded">Declare Winner</button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Current voting period: Dec 9-15, 2024 • Total votes: 592
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="creatives" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Creatives Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Tshiamo Lens</h4>
                        <p className="text-sm text-gray-600">Photographer • Francistown • Verified</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">Verify</button>
                        <button className="bg-accent text-white px-3 py-1 rounded text-sm">Feature</button>
                        <button className="bg-primary text-white px-3 py-1 rounded text-sm">Edit</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Kgosi Designs</h4>
                        <p className="text-sm text-gray-600">Graphic Designer • Gaborone • Featured</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">Verify</button>
                        <button className="bg-accent text-white px-3 py-1 rounded text-sm">Feature</button>
                        <button className="bg-primary text-white px-3 py-1 rounded text-sm">Edit</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Nomsa Styles</h4>
                        <p className="text-sm text-gray-600">Hairstylist • Maun • Pending</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">Verify</button>
                        <button className="bg-accent text-white px-3 py-1 rounded text-sm">Feature</button>
                        <button className="bg-primary text-white px-3 py-1 rounded text-sm">Edit</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
