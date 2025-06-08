export type AudioMode = "volume" | "equalizer";

export interface VolumeControlProp {
    volume: number;
    onVolumeChange: (volume: number) => void;
    isMuted: boolean;
    onMuteToggle: (isMuted: boolean) => void;
}