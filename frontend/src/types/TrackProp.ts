export interface PlaylistProps {
    id?: number;
    name?: string;
    cover?: string;
    year?: number;
    color?: string;
    songs: Song[];
}

export interface Song {
    id: number;
    name: string;
    year: number | null;
    album: string | null;
    artist: string | null;
    duration_ms: number | null;
    cover: string | null;
    popularity: number | null;
    preview_url: string | null;
    filePath: string;
}