export type AudioMode = "volume" | "equalizer";

export interface VolumeControlProp {
    volume: number;
    onVolumeChange: (volume: number) => void;
    isMuted: boolean;
    onMuteToggle: (isMuted: boolean) => void;
}

export type PredefinedPreset = {
    name: string;
    values: number[];
};

export interface EqualizerControlProp {
    bandLabels: string[];
    bandValues: number[];
    onBandChange: (bandIndex: number, value: number) => void;
    onApplyPreset: (preset: PredefinedPreset) => void;
}

export interface AudioControlProps {
    currentMode: AudioMode;
    volumeProps: VolumeControlProp;
    equalizerProps: EqualizerControlProp;
}