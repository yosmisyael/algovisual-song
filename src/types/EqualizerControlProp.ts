export interface EqualizerControlProps {
    bands: (number | string)[];
    values: number[];
    onChange: (index: number, newValue: number) => void;
    onPresetChange: (preset: EqualizerPreset) => void;
}

export type EqualizerPreset = 'Normal' | 'Pop' | 'Classic' | 'Heavy M' | 'Custom';