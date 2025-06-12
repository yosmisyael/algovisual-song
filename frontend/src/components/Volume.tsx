import * as React from "react";
import type {VolumeControlProp} from "../types/AudioControlProp.ts";
import {useEffect, useRef} from "react";
import {Volume1, Volume2, VolumeX} from "lucide-react";

export const Volume = ({
    volume,
    onVolumeChange,
    isMuted,
    onMuteToggle
}: VolumeControlProp) => {
    const sliderRef = useRef<HTMLDivElement>(null);

    // Calculates the new volume (0-1) based on a click/drag position
    const getVolumeFromPointerEvent = (event: PointerEvent | React.PointerEvent) => {
        if (!sliderRef.current) return volume;
        const { left, width } = sliderRef.current.getBoundingClientRect();
        // Ensure width is not zero to prevent division by zero
        if (width === 0) return volume;
        const clickX = event.clientX - left;
        return Math.max(0, Math.min(1, clickX / width));
    };

    // Handles both click and drag on the slider
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        const newVolume = getVolumeFromPointerEvent(e);
        onVolumeChange(newVolume);

        const handlePointerMove = (moveEvent: PointerEvent) => {
            const movedVolume = getVolumeFromPointerEvent(moveEvent);
            onVolumeChange(movedVolume);
        };

        const handlePointerUp = () => {
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
        };

        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
    };

    useEffect(() => {
        const slider = sliderRef.current;

        // Handles mouse wheel scroll for volume adjustment
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const scrollAmount = e.deltaY > 0 ? -0.05 : 0.05; // 5% change
            const newVolume = Math.max(0, Math.min(1, volume + scrollAmount));
            onVolumeChange(newVolume);
        };

        if (slider) {
            slider.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (slider) {
                slider.removeEventListener('wheel', handleWheel);
            }
        };
    }, [volume, onVolumeChange]);

    // Dynamically selects the correct icon based on state
    const getIcon = () => {
        if (isMuted || volume === 0) return <VolumeX className="w-6 h-6 text-white/70" />;
        if (volume < 0.5) return <Volume1 className="w-6 h-6 text-white/70" />;
        return <Volume2 className="w-6 h-6 text-white/70" />;
    };

    // Calculate the volume percentage
    const volumePercentage = Math.round(volume * 100);

    return (
        <div className="flex items-center space-x-4">
            <button onClick={() => onMuteToggle(!isMuted)} className="hover:opacity-80 transition-opacity hover:cursor-pointer">
                {getIcon()}
            </button>

            {/* The main interactive slider area */}
            <div
                ref={sliderRef}
                className="flex-1 bg-slate-700 h-2 rounded-full relative cursor-pointer group"
                onPointerDown={handlePointerDown}
                role="slider"
            >
                {/* Progress Bar */}
                <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full"
                    style={{ width: `${volumePercentage}%`, pointerEvents: 'none' }}
                />

                <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-transform duration-150 group-hover:scale-110"
                    style={{ left: `${volumePercentage}%`}}
                />
            </div>
            <div className="text-sm font-bold w-12 text-center">{volumePercentage}%</div>
        </div>
    );
}