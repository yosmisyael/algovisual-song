import {useRef, useState, useEffect} from 'react';
import {
    Heart,
    SkipBack,
    Pause,
    SkipForward,
    Play,
} from 'lucide-react';
import type {Song} from "../types/TrackProp.ts";
import {formatMillis} from "../utils/PlayerUtils.ts";

interface PlayerProps {
    currentTrack: Song;
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
    onSkipNext: () => void;
    onSkipPrev: () => void;
}

const Player = ({ currentTrack, isPlaying, setIsPlaying, onSkipNext, onSkipPrev }: PlayerProps) => {
    const [isLiked, setIsLiked] = useState(true);
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isDragging, setIsDragging] = useState(false);

    // ref for HTML audio element and progress bar
    const audioRef = useRef<HTMLAudioElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    // handle time update - only update if not dragging
    const handleTimeUpdate = () => {
        if (audioRef.current && !isDragging) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    // handle drag track progress bar
    const handleScrub = (e: MouseEvent | React.MouseEvent) => {
        const progressBar = progressBarRef.current;
        if (!progressBar || !audioRef.current) return;

        const rect = progressBar.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(offsetX / rect.width, 1));
        const newTime = percentage * duration;

        setCurrentTime(newTime);

        if (!isDragging) {
            audioRef.current.currentTime = newTime;
        }
    };

    // Attach listeners for dragging
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);

        const handleMouseMove = (e: MouseEvent) => {
            handleScrub(e);
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (audioRef.current) {
                const progressBar = progressBarRef.current;
                if (progressBar) {
                    const rect = progressBar.getBoundingClientRect();
                    const offsetX = e.clientX - rect.left;
                    const percentage = Math.max(0, Math.min(offsetX / rect.width, 1));
                    const newTime = percentage * duration;
                    audioRef.current.currentTime = newTime;
                    setCurrentTime(newTime);
                }
            }

            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        handleScrub(e);
    };

    // load track metadata
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    // Handle skip previous with restart logic
    const handleSkipPrevious = () => {
        if (audioRef.current && currentTime > 5) {
            // If more than 5 seconds, restart current song
            audioRef.current.currentTime = 0;
            setCurrentTime(0);
            if (!isPlaying) {
                setIsPlaying(true);
            }
        } else {
            // Skip to previous song
            onSkipPrev();
        }
    };

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    // effect to handle play/pause track
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => console.error('Error playing audio:', err));
            }
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    // Reset when track changes
    useEffect(() => {
        setCurrentTime(0);
        setDuration(0);
        setIsDragging(false);

        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = 0;

            // If we should be playing, play the new track when it's ready
            if (isPlaying) {
                const handleCanPlay = () => {
                    audio.play().catch(err => console.error('Error playing audio:', err));
                    audio.removeEventListener('canplay', handleCanPlay);
                };
                audio.addEventListener('canplay', handleCanPlay);
            }
        }
    }, [currentTrack.id]);

    return (
        <div className="col-span-4 flex flex-col space-y-6">
            {/* Album Art */}
            <div className="relative overflow-hidden bg-white/10 rounded-2xl h-[60vh] p-8 flex justify-center">
                {/* background blur */}
                <div style={{
                    backgroundImage: `url("${currentTrack.cover}")`,
                    filter: 'blur(4px)',
                    backgroundSize: 'cover',
                    transform: 'scale(1.1)',
                }}
                     className="absolute w-full h-full inset-0 z-0"></div>
                {/* cover image */}
                <div className="relative rounded-lg mx-auto">
                    <img
                        src={`${currentTrack.cover}`}
                        alt="album cover"
                        className="rounded-lg shadow-lg z-10 w-fit h-full mx-auto"
                    />
                </div>
            </div>

            {/* Player Controls */}
            <div className="flex space-x-6">
                <div className="flex-1 bg-teal-600/30 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">{currentTrack.name}</h3>
                        <Heart
                            className={`w-6 h-6 cursor-pointer ${isLiked ? 'fill-blue-400 text-blue-400' : 'text-white'}`}
                            onClick={() => setIsLiked(!isLiked)}
                        />
                    </div>
                    <div className="text-sm text-white/70 mb-6">{currentTrack.artist}</div>

                    {/* Draggable Progress Bar */}
                    <div
                        ref={progressBarRef}
                        className="bg-white/20 h-2 rounded-full mb-6 relative cursor-pointer select-none"
                        onMouseDown={handleMouseDown}
                    >
                        <div
                            className="bg-orange-500 h-2 rounded-full relative"
                            style={{ width: `${progressPercentage}%` }}
                        >
                            {/* The seeker handle */}
                            <div
                                className="absolute top-1/2  w-4 h-4 bg-white rounded-full shadow cursor-pointer"
                                style={{
                                    left: `calc(100% - 8px)`,
                                    transform: 'translateY(-50%)'
                                }}
                            ></div>
                        </div>
                    </div>
                    <div className="flex justify-between text-sm translate-y-[-20px]">
                        <audio
                            ref={audioRef}
                            src={currentTrack.filePath ?? ''}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onEnded={onSkipNext}
                            preload="metadata"
                        />
                        <p>{formatMillis(currentTime * 1000)}</p>
                        <p>{duration > 0 ? formatMillis(duration * 1000) : formatMillis(currentTrack.duration_ms || 0)}</p>
                    </div>

                    <div className="flex items-center justify-center space-x-4">
                        <button
                            className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:bg-black/80 transition-colors hover:cursor-pointer"
                            onClick={handleSkipPrevious}
                        >
                            <SkipBack className="w-5 h-5" />
                        </button>
                        <button
                            className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:bg-black/80 transition-colors hover:cursor-pointer"
                            onClick={() => setIsPlaying(!isPlaying)}
                        >
                            { isPlaying ?
                                <Pause className="w-5 h-5" />
                                :
                                <Play className="w-5 h-5" />
                            }
                        </button>
                        <button
                            onClick={() => {
                                onSkipNext();
                                setIsPlaying(true);
                            }}
                            className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:bg-black/80 transition-colors hover:cursor-pointer"
                        >
                            <SkipForward className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Player;