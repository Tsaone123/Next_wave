import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Clock, Headphones, CheckCircle, TrendingUp, Award, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type Nominee } from "@shared/schema";

export default function Voting() {
  const [expandedSongs, setExpandedSongs] = useState<Record<number, boolean>>({});
  const [hasVoted, setHasVoted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: nominees = [], isLoading } = useQuery({
    queryKey: ["/api/nominees"],
  });

  const { data: voteStatus } = useQuery({
    queryKey: ["/api/votes/check/2024-12-09"],
  });

  const voteMutation = useMutation({
    mutationFn: async (nomineeId: number) => {
      const response = await apiRequest("POST", "/api/votes", {
        nomineeId,
        weekDate: "2024-12-09",
      });
      return response.json();
    },
    onSuccess: () => {
      setHasVoted(true);
      toast({
        title: "Vote cast successfully!",
        description: "Thank you for voting! Come back next week for new nominees.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/nominees"] });
      queryClient.invalidateQueries({ queryKey: ["/api/votes/check/2024-12-09"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Voting failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleSongs = (nomineeId: number) => {
    setExpandedSongs(prev => ({
      ...prev,
      [nomineeId]: !prev[nomineeId]
    }));
  };

  const handleVote = (nomineeId: number) => {
    if (hasVoted || voteStatus?.hasVoted) {
      toast({
        title: "Already voted",
        description: "You can only vote once per week!",
        variant: "destructive",
      });
      return;
    }
    voteMutation.mutate(nomineeId);
  };

  const getBadgeIcon = (votes: number) => {
    const maxVotes = Math.max(...nominees.map((n: Nominee) => n.votes || 0));
    if (votes === maxVotes) return <Award className="h-3 w-3 mr-1" />;
    if (votes > maxVotes * 0.7) return <TrendingUp className="h-3 w-3 mr-1" />;
    return <Star className="h-3 w-3 mr-1" />;
  };

  const getBadgeColor = (votes: number) => {
    const maxVotes = Math.max(...nominees.map((n: Nominee) => n.votes || 0));
    if (votes === maxVotes) return "bg-green-100 text-green-800";
    if (votes > maxVotes * 0.7) return "bg-orange-100 text-orange-800";
    return "bg-blue-100 text-blue-800";
  };

  const getBadgeText = (votes: number) => {
    const maxVotes = Math.max(...nominees.map((n: Nominee) => n.votes || 0));
    if (votes === maxVotes) return "Leading";
    if (votes > maxVotes * 0.7) return "Rising";
    return "Competing";
  };

  return (
    <section id="vote" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-poppins mb-4 text-gray-800">VoteYourWeeklyStar</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Vote for your favorite artist! The winner becomes our next Artist of the Week.
          </p>
          <div className="mt-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 inline-block">
            <p className="text-lg font-semibold text-gray-800 flex items-center">
              <Clock className="mr-2" size={20} />
              Voting ends: Sunday, December 15, 2024 at 11:59 PM
            </p>
          </div>
        </div>

        {/* Voting Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Loading nominees...</p>
            </div>
          ) : nominees.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No nominees available for voting.</p>
            </div>
          ) : (
            nominees.map((nominee: Nominee) => (
              <Card key={nominee.id} className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6">
                  <img 
                    src={nominee.photoUrl} 
                    alt={nominee.name} 
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{nominee.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{nominee.bio}</p>
                  
                  {/* Vote Count */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">
                      Current Votes: <span className="font-semibold text-primary">{nominee.votes || 0}</span>
                    </span>
                    <Badge className={getBadgeColor(nominee.votes || 0)}>
                      {getBadgeIcon(nominee.votes || 0)}
                      {getBadgeText(nominee.votes || 0)}
                    </Badge>
                  </div>
                  
                  {/* Listen Button */}
                  <Button
                    onClick={() => toggleSongs(nominee.id)}
                    className="w-full bg-secondary/20 text-secondary hover:bg-secondary/30 py-2 rounded-xl font-semibold transition-colors mb-3"
                  >
                    <Headphones className="mr-2" size={16} />
                    Listen to Songs
                  </Button>
                  
                  {/* Songs Section */}
                  {expandedSongs[nominee.id] && (
                    <div className="space-y-3 mb-4">
                      {nominee.songs.map((song, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center mb-1">
                            <Volume2 className="h-4 w-4 mr-2 text-gray-600" />
                            <p className="text-sm font-medium text-gray-800">{index + 1}. {song}</p>
                          </div>
                          <audio controls className="w-full">
                            <source src="#" type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button
                    onClick={() => handleVote(nominee.id)}
                    disabled={hasVoted || voteStatus?.hasVoted || voteMutation.isPending}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {voteMutation.isPending ? (
                      "Voting..."
                    ) : hasVoted || voteStatus?.hasVoted ? (
                      <>
                        <CheckCircle className="mr-2" size={16} />
                        Already Voted
                      </>
                    ) : (
                      <>
                        <Star className="mr-2" size={16} />
                        Vote for {nominee.name}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Voting Status */}
        {(hasVoted || voteStatus?.hasVoted) && (
          <div className="text-center">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl inline-block">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="mr-2 text-green-500" size={24} />
                  <p className="text-lg font-semibold text-gray-800">Thank you for voting!</p>
                </div>
                <p className="text-gray-600">You can vote once per week. Come back next week for new nominees!</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
