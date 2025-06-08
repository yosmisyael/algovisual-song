export interface VolumeControlProp {
    volume: number;
    onVolumeChange: (volume: number) => void;
    isMuted: boolean;
    onMuteToggle: (isMuted: boolean) => void;
}