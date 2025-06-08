import {useRef, useState} from 'react';
import {
  BarChart3,
  Music,
  Bell,
  Settings,
  Heart,
  SkipBack,
  Pause,
  SkipForward, Play,
} from 'lucide-react';
import AudioControl from "../components/AudioControl.tsx";
import {Lyrics} from "../components/Lyrics.tsx";
import type {AlbumProps} from "../types/AlbumProp.ts";
import {Albums} from "../components/Albums.tsx";
import {SongDetail} from "../components/SongDetail.tsx";
import Navbar from "../components/Navbar.tsx";

const MusicPlayerInterface = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(true);

  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);

  const volumeBeforeMute = useRef(volume);

  const handleMuteAction = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(volumeBeforeMute.current);
    } else {
      setIsMuted(true);
      volumeBeforeMute.current = volume;
      setVolume(0);
    }
  }

  const handleVolumeChange = (volume: number) => {
    if (isMuted && volume > 0) {
      setIsMuted(false);
    }
    if (volume === 0) {
      setIsMuted(true);
    }
    setVolume(volume);
  }

  const albums: AlbumProps[] = [
    { id: 1, cover: '/api/placeholder/80/80', color: 'bg-orange-400' },
    { id: 2, cover: '/api/placeholder/80/80', color: 'bg-green-500' },
    { id: 3, cover: '/api/placeholder/80/80', color: 'bg-red-600' },
    { id: 4, cover: '/api/placeholder/80/80', color: 'bg-blue-500' },
    { id: 5, cover: '/api/placeholder/80/80', color: 'bg-yellow-600' }
  ];

  const sidebarItems = [
    { icon: Music, label: 'Playing' },
    { icon: Music, label: 'Playlist' },
    { icon: BarChart3, label: 'Charts' },
    { icon: Music, label: 'Library' }
  ];

  const lyrics = [
    "I know a place",
    "It's somewhere I go when I need to remember your face",
    "We get married in our heads",
    "Something to do while we try to recall how we met",
    "",
    "Do you think I have forgotten?",
    "Do you think I have forgotten?", 
    "Do you think I have forgotten about you?",
    "",
    "You and I (don't let go), we're alive (don't let go)",
    "With nothing to do, I could lay and just look in your eyes",
    "",
    "Wait (don't let go) and pretend (don't let go)",
    "Hold on and hope that we'll find our way back in the end",
    "",
    "Do you think I have forgotten?",
    "Do you think I have forgotten?",
    "Do you think I have forgotten about you?",
    "Do you think I have forgotten?",
    "Do you think I have forgotten?",
    "Do you think I have forgotten about you?"
  ];
  return (
    <section className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Navbar />
      {/* Main Content */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-20 bg-black/20 backdrop-blur-sm flex flex-col items-center py-6 space-y-6">
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
            <Music className="w-6 h-6 text-green-400" />
          </div>

          {sidebarItems.map((item, index) => (
            <div key={index} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
              <item.icon className="w-5 h-5" />
            </div>
          ))}

          <div className="flex-1" />

          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
            <Bell className="w-5 h-5" />
          </div>

          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
            <Settings className="w-5 h-5" />
          </div>

          <div className="w-12 h-12 bg-white rounded-full"></div>
        </div>
        {/* Content Window */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 grid grid-cols-8 p-6 space-x-6">
            {/* Left Panel - Albums */}
            <div className="col-span-2 space-y-4 ">
              <Albums albums={albums} />
              <SongDetail artists={["aespa"]} genre={"kpop"} year={2024} likes={300000} />
            </div>

            {/* Center Panel - Now Playing */}
            <div className="col-span-4 flex flex-col space-y-6">
              {/* Album Art */}
              <div className="relative overflow-hidden bg-white/10 rounded-2xl p-8 flex justify-center">
                {/* background blur */}
                <div style={{
                    backgroundImage: `url("https://i1.sndcdn.com/artworks-qNhCnhKWHVfJzkwd-fg7rPA-t500x500.jpg")`,
                    filter: 'blur(4px)',
                    backgroundSize: 'cover',
                    transform: 'scale(1.1)',
                  }}
                 className="absolute w-full h-full inset-0 z-0"></div>
                {/* cover image */}
                <div className="relative bg-gradient-to-br from-white to-gray-300 rounded-lg">
                  <img
                      src="https://i1.sndcdn.com/artworks-qNhCnhKWHVfJzkwd-fg7rPA-t500x500.jpg"
                      alt="album cover"
                      className="rounded-lg shadow-lg z-10"
                  />
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex space-x-6">
                <div className="flex-1 bg-teal-600/30 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">About You</h3>
                    <Heart
                      className={`w-6 h-6 cursor-pointer ${isLiked ? 'fill-blue-400 text-blue-400' : 'text-white'}`}
                      onClick={() => setIsLiked(!isLiked)}
                    />
                  </div>
                  <div className="text-sm text-white/70 mb-6">The 1975</div>

                  <div className="bg-orange-600 h-2 rounded-full mb-6 relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full"></div>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <button className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                      className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      { isPlaying ?
                        <Play className="w-5 h-5" />
                      :
                        <Pause className="w-5 h-5" />
                      }
                    </button>
                    <button className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
                      <SkipForward className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Lyrics & Equalizer */}
            <div className="col-span-2 space-y-6">
              {/* Lyrics */}
              <Lyrics lyrics={lyrics} />
              {/* Volume */}
              <AudioControl volume={volume} onVolumeChange={handleVolumeChange} isMuted={isMuted} onMuteToggle={handleMuteAction} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MusicPlayerInterface;

{/*<div className="w-full h-full bg-gray-200 flex items-center justify-center">*/}
{/*  <div className="w-32 h-32 bg-black rounded-full flex items-center justify-center">*/}
{/*    <div className="w-16 h-16 bg-gray-400 rounded-full"></div>*/}
{/*  </div>*/}
{/*</div>*/}