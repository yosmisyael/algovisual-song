import {type FC, useState} from "react";
import type {AudioControlProps, AudioMode} from "../types/AudioControlProp.ts";
import Dropdown from "./Dropdown.tsx";
import type {DropdownOptions} from "../types/DropdownProp.ts";
import Equalizer from "../Equalizer.tsx";
import {Volume} from "./Volume.tsx";

const AudioControl: FC<{ audioControlProps: AudioControlProps }> = ({ audioControlProps }: { audioControlProps: AudioControlProps }) => {
    const { currentMode, volumeProps, equalizerProps } = audioControlProps;

    // Define available audio control modes
    const audioOpts: DropdownOptions<AudioMode>[] = [
        {
            value: "volume",
        },
        {
            value: "equalizer",
        },
    ];

    // Define audio mode state
    const [audioMode, setAudioMode] = useState<AudioMode>(currentMode);

    // Handle audio mode changes
    const onChangeAudioMode = (AudioControlMode: AudioMode) => {
        setAudioMode(AudioControlMode);
    }

    return (
        <div className="w-full bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex justify-between items-center pb-6">
                <h5 className="text-xl font-semibold">Audio Control</h5>
                {/* select audio control mode */}
                <Dropdown options={audioOpts} value={audioMode} onChange={onChangeAudioMode} />
            </div>
            {
                // Volume mode
                audioMode === 'volume' ? (
                    <Volume
                        volume={volumeProps.volume}
                        onVolumeChange={volumeProps.onVolumeChange}
                        isMuted={volumeProps.isMuted}
                        onMuteToggle={volumeProps.onMuteToggle}
                    />
                ) : (
                    // Equalizer mode
                    <Equalizer
                        bandLabels={equalizerProps.bandLabels}
                        bandValues={equalizerProps.bandValues}
                        onBandChange={equalizerProps.onBandChange}
                        onApplyPreset={equalizerProps.onApplyPreset}
                    />
                )
            }

        </div>
    );
}

export default AudioControl;