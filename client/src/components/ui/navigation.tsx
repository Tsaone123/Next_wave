import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold font-poppins bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              NextWave
            </h1>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-primary transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection('playlist')} className="text-gray-700 hover:text-primary transition-colors">
              Share Playlist
            </button>
            <button onClick={() => scrollToSection('events')} className="text-gray-700 hover:text-primary transition-colors">
              Events
            </button>
            <button onClick={() => scrollToSection('directory')} className="text-gray-700 hover:text-primary transition-colors">
              Directory
            </button>
            <button onClick={() => scrollToSection('artist-week')} className="text-gray-700 hover:text-primary transition-colors">
              Artist of Week
            </button>
            <button onClick={() => scrollToSection('vote')} className="text-gray-700 hover:text-primary transition-colors">
              Vote
            </button>
            <button onClick={() => scrollToSection('creatives')} className="text-gray-700 hover:text-primary transition-colors">
              Creatives
            </button>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-primary"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button onClick={() => scrollToSection('home')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary">
              Home
            </button>
            <button onClick={() => scrollToSection('playlist')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary">
              Share Playlist
            </button>
            <button onClick={() => scrollToSection('events')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary">
              Events
            </button>
            <button onClick={() => scrollToSection('directory')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary">
              Directory
            </button>
            <button onClick={() => scrollToSection('artist-week')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary">
              Artist of Week
            </button>
            <button onClick={() => scrollToSection('vote')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary">
              Vote
            </button>
            <button onClick={() => scrollToSection('creatives')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary">
              Creatives
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
