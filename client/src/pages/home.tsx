import { useState } from "react";
import Navigation from "@/components/ui/navigation";
import Hero from "@/components/ui/hero";
import PlaylistUpload from "@/components/ui/playlist-upload";
import Events from "@/components/ui/events";
import PlaylistDirectory from "@/components/ui/playlist-directory";
import ArtistOfWeek from "@/components/ui/artist-of-week";
import Voting from "@/components/ui/voting";
import CreativesDirectory from "@/components/ui/creatives-directory";
import AdminPanel from "@/components/ui/admin-panel";

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-cyan-50">
      <Navigation />
      
      {/* Admin Toggle */}
      <div className="fixed bottom-4 right-4 z-50">
        <label className="inline-flex items-center cursor-pointer bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="sr-only"
          />
          <div className={`relative w-11 h-6 bg-gray-200 rounded-full transition-colors ${
            isAdmin ? 'bg-primary' : ''
          }`}>
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              isAdmin ? 'translate-x-5' : ''
            }`} />
          </div>
          <span className="ml-3 text-sm font-medium text-gray-700">Admin</span>
        </label>
      </div>

      <Hero />
      <PlaylistUpload />
      <Events />
      <PlaylistDirectory isAdmin={isAdmin} />
      <ArtistOfWeek isAdmin={isAdmin} />
      <Voting />
      <CreativesDirectory />
      
      {isAdmin && <AdminPanel />}
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold font-poppins mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                NextWave
              </h3>
              <p className="text-gray-400 mb-4">
                The Ground to mine hidden talents. Discover, showcase, and celebrate creative talent in our community.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-youtube text-xl"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#playlist" className="hover:text-white transition-colors">Share Playlist</a></li>
                <li><a href="#events" className="hover:text-white transition-colors">Events</a></li>
                <li><a href="#directory" className="hover:text-white transition-colors">Playlist Directory</a></li>
                <li><a href="#vote" className="hover:text-white transition-colors">Vote for Artists</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#creatives" className="hover:text-white transition-colors">Creatives Directory</a></li>
                <li><a href="#artist-week" className="hover:text-white transition-colors">Artist of the Week</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community Guidelines</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 NextWave. All rights reserved. Made with ❤️ for the creative community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
