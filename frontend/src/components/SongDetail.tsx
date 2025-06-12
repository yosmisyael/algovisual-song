import type {Song} from "../types/TrackProp.ts";
import {formatMillis} from "../utils/PlayerUtils.ts";

export const SongDetail = ({ song } : { song: Song }) => {
    return (
        <div className="flex-1 bg-teal-500/20 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-2">{ song.name }</h3>
            <div className="flex flex-col gap-2">
                <div>
                    <h6 className="space-y-2 text-lg font-semibold text-white/90">{ song.artist }</h6>
                    <p className="space-y-2 text-sm font-semibold text-white/70">Artist</p>
                </div>
                <div>
                    <h6 className="space-y-2 text-lg font-semibold text-white/90">{ song.album }</h6>
                    <p className="space-y-2 text-sm font-semibold text-white/70">Album</p>
                </div>
                <div>
                    <h6 className="space-y-2 text-lg font-semibold text-white/90">{ song.year }</h6>
                    <p className="space-y-2 text-sm font-semibold text-white/70">Released Year</p>
                </div>
                <div>
                    <h6 className="space-y-2 text-lg font-semibold text-white/90">{ song.popularity }</h6>
                    <p className="space-y-2 text-sm font-semibold text-white/70">Popularity</p>
                </div>
                <div>
                    <h6 className="space-y-2 text-lg font-semibold text-white/90">{ formatMillis(song.duration_ms!) }</h6>
                    <p className="space-y-2 text-sm font-semibold text-white/70">Duration</p>
                </div>
            </div>
        </div>
    );
}