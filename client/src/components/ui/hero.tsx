import { Music, UserPlus } from "lucide-react";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background with artistic elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        {/* Black musicians recording in studio */}
        <div className="mb-8 relative">
          <img 
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
            alt="Black musicians recording in studio" 
            className="w-32 h-32 rounded-full mx-auto mb-8 object-cover shadow-2xl ring-4 ring-white/50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent rounded-full"></div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold font-poppins mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
          NextWave
        </h1>
        
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-30"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
            <p className="text-2xl md:text-3xl font-poppins font-semibold text-gray-800 mb-4">
              "The Ground to mine hidden talents"
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover, showcase, and celebrate the incredible creative talent in our community. 
              From musicians to artists, photographers to designers - your stage awaits.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => scrollToSection('playlist')}
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
          >
            <Music className="mr-2" size={20} />
            Share Your Playlist
          </button>
          <button
            onClick={() => scrollToSection('creatives')}
            className="bg-white text-primary px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-primary inline-flex items-center justify-center"
          >
            <UserPlus className="mr-2" size={20} />
            Join Directory
          </button>
        </div>
      </div>
    </section>
  );
}
