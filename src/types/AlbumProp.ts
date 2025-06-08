export interface AlbumProps {
    id?: number;
    name?: string;
    cover: string;
    year?: number;
    color?: string;
}

export interface SongDetailProps {
    artists: string[];
    genre: string;
    year: number;
    likes: number;
}