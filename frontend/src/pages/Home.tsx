import {useRef, useState, useEffect} from 'react';
import AudioControl from "../components/AudioControl.tsx";
import {Lyrics} from "../components/Lyrics.tsx";
import type {PlaylistProps, Song} from "../types/TrackProp.ts";
import {Playlist} from "../components/Playlist.tsx";
import {SongDetail} from "../components/SongDetail.tsx";
import type {
  AudioControlProps,
  EqualizerControlProp,
  PredefinedPreset,
  VolumeControlProp
} from "../types/AudioControlProp.ts";
import Navbar from "../components/Navbar.tsx";
import Sidebar from "../components/Sidebar.tsx";
import {fetchApiData} from "../lib/api.ts";
import Player from "../components/Player.tsx";

const MusicPlayerInterface = () => {
  // states for tracks
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // states for playlist
  const [playlist, setPlaylist] = useState<PlaylistProps>({
    id: 1,
    name: "My Playlists",
    cover: "",
    year: 2023,
    songs: []
  });

  // handle skip to next song action
  const handleSkipNext = () => {
    if (playlist.songs.length === 0) return;

    setCurrentTrackIndex((prev: number) => {
      const nextIndex = prev + 1;
      if (nextIndex < playlist.songs.length) {
        return nextIndex;
      } else {
        return prev; // Stay at current if at the end
      }
    });
  }

  // handle skip to previous song action
  const handleSkipPrev = () => {
    if (playlist.songs.length === 0) return;

    setCurrentTrackIndex((prev: number) => {
      const prevIndex = prev - 1;
      if (prevIndex >= 0) {
        return prevIndex;
      } else {
        return prev; // Stay at current if at the beginning
      }
    });
  }

  // handle select track
  const handleSelectTrack = (trackId: number) => {
    const trackIndex = playlist.songs.findIndex(song => song.id === trackId);
    if (trackIndex !== -1) {
      setCurrentTrackIndex(trackIndex);
      setIsPlaying(true);
    }
  }

  const currentTrack = playlist.songs[currentTrackIndex];

  // states for audio control
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [equalizerBand, setEqualizerBand] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: Song[] = await fetchApiData('http://localhost:3000/data') ?? [];

        // update playlists state directly with the songs
        setPlaylist((prev) => ({
          ...prev,
          songs: response
        }));

        // Only set error if we explicitly got null from the API and no data
        if (response.length === 0) {
          console.log("No tracks found or failed to load");
          setError("No tracks available or failed to load tracks.");
        }

      } catch (err) {
        // Handle any unexpected errors that might occur outside the utility function
        console.error("Unexpected error in fetchTracks:", err);
        setError("An unexpected error occurred. Please try again.");
        // Set empty arrays in case of error
        setPlaylist((prev) => ({
          ...prev,
          songs: []
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  const handleEqualizerChange = (bandIndex: number, value: number) => {
    const newEqualizerBandsVal = [...equalizerBand];
    newEqualizerBandsVal[bandIndex] = value;
    setEqualizerBand(newEqualizerBandsVal);
  }

  const handleEqualizerPresetChange = (preset: PredefinedPreset) => {
    setEqualizerBand([...preset.values]);
  }

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

  const volumeControlProp: VolumeControlProp = {
    volume,
    onVolumeChange: handleVolumeChange,
    isMuted,
    onMuteToggle: handleMuteAction,
  }

  const equalizerControlProp: EqualizerControlProp = {
    bandLabels: ['Gain', '32', '64', '125', '250', '500', '1k', '2k', '4k', '8k', '16k'],
    bandValues: equalizerBand,
    onBandChange: handleEqualizerChange,
    onApplyPreset: handleEqualizerPresetChange,
  }

  const audioControlProp: AudioControlProps = {
    volumeProps: volumeControlProp,
    equalizerProps: equalizerControlProp,
    currentMode: "equalizer"
  }

  return (
      <section className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <Navbar />
        {/* Main Content */}
        <div className="flex">
          {/* Left Sidebar */}
          <Sidebar />
          {/* Content Window */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 grid grid-cols-8 p-6 space-x-6">
              {/* Left Panel - Albums */}
              <div className="col-span-2 space-y-4 ">
                {loading ? (
                    <div className="bg-white/10 rounded-2xl p-6 animate-pulse">
                      <div className="text-center text-white/70">Loading playlist...</div>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/20 rounded-2xl p-6">
                      <div className="text-center text-red-200">{error}</div>
                    </div>
                ) : playlist.songs.length > 0 ? (
                    <>
                      <Playlist
                          playlist={playlist}
                          currentTrack={currentTrackIndex + 1}
                          onClickTrack={handleSelectTrack}
                      />
                      <SongDetail song={playlist.songs[currentTrackIndex]}  />
                    </>
                ) : (
                    <div className="bg-white/10 rounded-2xl p-6">
                      <div className="text-center text-white/70">No songs available</div>
                    </div>
                )}
              </div>

              {/* Center Panel - Now Playing */}
              { playlist.songs.length > 0 && currentTrack && (
                  <Player
                      currentTrack={currentTrack}
                      isPlaying={isPlaying}
                      setIsPlaying={setIsPlaying}
                      onSkipNext={handleSkipNext}
                      onSkipPrev={handleSkipPrev}
                  />
              )}

              {/* Right Panel - Lyrics & Equalizer */}
              <div className="col-span-2 space-y-6">
                {/* Lyrics */}
                <Lyrics lyrics={lyrics} />
                {/* Volume */}
                <AudioControl audioControlProps={ audioControlProp }/>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default MusicPlayerInterface;