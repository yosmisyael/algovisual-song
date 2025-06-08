import type {SongDetailProps} from "../types/AlbumProp.ts";

export const SongDetail = ({ artists, genre, year, likes }: SongDetailProps) => {
    return (
        <div className="flex-1 bg-teal-500/20 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-2">About You</h3>
            <div className="space-y-2 text-lg font-semibold text-white/70">
                <div>Artist: { artists.join(", ") }</div>
                <div>Genre: { genre.toLocaleUpperCase() }</div>
                <div>Year: { year }</div>
                <div>Likes: { Math.floor(likes/1000) === 0 ? likes : `${Math.floor(likes/1000)}k` }</div>
            </div>
        </div>
    );
}