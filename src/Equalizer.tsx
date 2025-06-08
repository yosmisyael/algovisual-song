import type {EqualizerControlProp, PredefinedPreset} from "./types/AudioControlProp.ts";
import {useRef, useEffect} from "react";
import * as React from "react";

const EqualizerControl = ({ bandLabels, bandValues, onBandChange, onApplyPreset }: EqualizerControlProp) => {
    // Define some presets for equalizer
    const predefinedBandsSettings: PredefinedPreset[] = [
        {
            name: "normal",
            values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            name: "pop",
            values: [0, 5, 4, 2, -2, -3, -1, 2, 4, 5, 4],
        },
        {
            name: "classic",
            values: [0, 3, 2, 1, 0, 0, 0, 1, 2, 3, 4],
        },
        {
            name: "metal",
            values: [0, 6, 5, 3, 1, -5, -4, 2, 5, 6, 5],
        },
    ];

    // Handle slider drag
    const handleSliderChange = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const y = event.clientY - rect.top;
        const height = rect.height;
        const percentage = Math.max(0, Math.min(100, ((height - y) / height) * 100));
        const dbValue = ((percentage / 100) * 24) - 12;
        onBandChange(index, Math.round(dbValue));
    };

    // Create refs for each slider column to attach wheel listeners
    const sliderColumnRefs = useRef<(HTMLDivElement)[]>([]);
    const bandValuesRef = useRef(bandValues);
    bandValuesRef.current = bandValues;

    const onBandChangeRef = useRef(onBandChange);
    onBandChangeRef.current = onBandChange;

    useEffect(() => {
        const currentRefs = sliderColumnRefs.current;
        const cleanups: (() => void)[] = [];

        currentRefs.forEach((ref, index) => {
            if (!ref) {
                return;
            }

            const handleWheel = (e: WheelEvent) => {
                // Prevent the page from scrolling when adjusting the slider
                e.preventDefault();

                // Get the latest values from refs to avoid stale state
                const currentValue = bandValuesRef.current[index];
                const changeHandler = onBandChangeRef.current;

                let newValue;

                if (e.deltaY < 0) { // Scrolling up increases the value
                    newValue = Math.min(12, currentValue + 1);
                } else { // Scrolling down decreases the value
                    newValue = Math.max(-12, currentValue - 1);
                }

                // Only call the change handler if the value actually changed
                if (newValue !== currentValue) {
                    changeHandler(index, newValue);
                }
            };

            ref.addEventListener('wheel', handleWheel, { passive: false });

            // Add a cleanup function for this specific listener
            cleanups.push(() => {
                if (ref) {
                    ref.removeEventListener('wheel', handleWheel);
                }
            });
        });

        // Return a single function that runs all the cleanup functions on unmount
        return () => {
            cleanups.forEach(cleanup => cleanup());
        };
    }, []);

    return (
        <div className="bg-slate-800/50 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Setting Equalizer</h3>
            </div>

            {/* Equalizer sliders */}
            <div className="flex justify-between px-4 items-end mb-6">
                {bandLabels.map((band, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center space-y-3"
                        ref={el => {sliderColumnRefs.current[index] = el!}}>
                        {/* Slider Container */}
                        <div className="relative h-48 w-6 flex items-center justify-center">
                            {/* Background Track */}
                            <div className="absolute w-2 h-full bg-slate-600 rounded-full"></div>

                            {/* Center Line (0 dB) */}
                            <div className="absolute w-3 h-0.5 bg-slate-400 left-1/2 transform -translate-x-1/2"
                                 style={{ top: '50%' }}></div>

                            {/* Active Track (from center to slider position) */}
                            <div className="absolute w-2 bg-gradient-to-t from-teal-800 to-teal-300 rounded-full"
                                 style={{
                                     height: `${Math.abs(bandValues[index] / 12) * 50}%`,
                                     top: bandValues[index] >= 0 ? `${50 - (bandValues[index] / 12 * 50)}%` : '50%',
                                     bottom: bandValues[index] < 0 ? `${50 - (Math.abs(bandValues[index]) / 12 * 50)}%` : '50%'
                                 }}>
                            </div>

                            {/* Clickable area for direct positioning */}
                            <div
                                className="absolute inset-0 cursor-pointer"
                                onClick={(e) => handleSliderChange(index, e)}
                            ></div>

                            {/* Slider Handle */}
                            <div
                                className="absolute w-4 h-4 bg-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform border-2 border-slate-300 z-10"
                                style={{
                                    top: `${50 - (bandValues[index] / 12 * 50)}%`,
                                    transform: 'translateY(-50%)'
                                }}
                                onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                                    // Prevent default browser actions like text selection during drag
                                    e.preventDefault();

                                    // The slider track is the parent of the handle
                                    const sliderTrack = e.currentTarget.parentElement;
                                    if (!sliderTrack) return;

                                    // Get the bounding rectangle of the track ONCE at the start of the drag.
                                    const rect = sliderTrack.getBoundingClientRect();
                                    const height = rect.height;

                                    const handleMouseMove = (moveEvent: MouseEvent) => {
                                        // Use the stable 'rect' and 'height' from the closure
                                        const y = moveEvent.clientY - rect.top;
                                        const percentage = Math.max(0, Math.min(100, ((height - y) / height) * 100));
                                        const dbValue = ((percentage / 100) * 24) - 12;
                                        onBandChange(index, Math.round(dbValue));
                                    };

                                    const handleMouseUp = () => {
                                        document.removeEventListener('mousemove', handleMouseMove);
                                        document.removeEventListener('mouseup', handleMouseUp);
                                    };

                                    document.addEventListener('mousemove', handleMouseMove);
                                    document.addEventListener('mouseup', handleMouseUp);
                                }}
                            ></div>
                        </div>

                        {/* Band Label */}
                        <span className="text-xs text-white/70 font-medium">{band}</span>
                    </div>
                ))}
            </div>

            <div className="flex justify-center space-x-3 flex-wrap gap-2">
                {predefinedBandsSettings.map((preset) => (
                    <button
                        key={preset.name}
                        onClick={() => onApplyPreset(preset)}
                        className={`capitalize px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border hover:cursor-pointer ${
                            JSON.stringify(bandValues) === JSON.stringify(preset.values)
                                ? 'bg-teal-500 text-white shadow-lg border-transparent'
                                : 'bg-slate-700/50 text-white/80 border-slate-500 hover:bg-slate-600/70 hover:border-slate-400'
                        }`}
                    >
                        {preset.name}
                    </button>
                ))}
            </div>

            {/* Current values display */}
            <div className="mt-6 text-center">
                <div className="text-xs text-white/50">
                    Current values: [{bandValues.map(val => `${val > 0 ? '+' : ''}${val}`).join(', ')}] dB
                </div>
            </div>
        </div>
    );
}

export default EqualizerControl;