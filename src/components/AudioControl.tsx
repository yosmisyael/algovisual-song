import {type FC, useState} from "react";
import type {AudioMode, VolumeControlProp} from "../types/AudioControlProp.ts";
import Dropdown from "./Dropdown.tsx";
import type {DropdownOptions} from "../types/DropdownProp.ts";
import Equalizer from "../Equalizer.tsx";
import {Volume} from "./Volume.tsx";

const AudioControl: FC<VolumeControlProp> = ({
        volume,
        onVolumeChange,
        isMuted,
        onMuteToggle
}: VolumeControlProp) => {

    // Define available audio control modes
    const audioOpts: DropdownOptions<AudioMode>[] = [
        {
            value: "volume",
        },
        {
            value: "equalizer",
        },
    ];

    const [audioMode, setAudioMode] = useState<AudioMode>('volume');

    const onChangeAudioMode = (AudioControlMode: AudioMode) => {
        setAudioMode(AudioControlMode);
    }

    return (
        <div className="w-full bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex justify-between items-center pb-6">
                <h5 className="text-xl font-semibold">Volume Control</h5>
                {/* select audio control mode */}
                <Dropdown options={audioOpts} value={audioMode} onChange={onChangeAudioMode} />
            </div>
            {/* simple mode */}
            {
                audioMode === 'volume' ? (
                    <Volume
                        volume={volume}
                        onVolumeChange={onVolumeChange}
                        isMuted={isMuted}
                        onMuteToggle={onMuteToggle}
                    />
                ) : (
                    <Equalizer />
                )
            }

            {/* equalizer mode */}
        </div>
    );
}

export default AudioControl;