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
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, this should be much more secure
    if (adminPassword === "nextwave2024") {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword("");
    } else {
      alert("Incorrect password");
      setAdminPassword("");
    }
  };
  
  const handleAdminLogout = () => {
    setIsAdmin(false);
    setShowAdminLogin(false);
    setAdminPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-cyan-50">
      <Navigation />
      
      {/* Admin Access */}
      <div className="fixed bottom-4 right-4 z-50">
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <div className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium">
              Admin Mode Active
            </div>
            <button
              onClick={handleAdminLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAdminLogin(true)}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <span className="text-sm font-medium text-gray-700">Admin Access</span>
          </button>
        )}
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Admin Login</h3>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
