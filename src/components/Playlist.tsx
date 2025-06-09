import type {PlaylistProps, Song} from "../types/TrackProp.ts";

export const Playlist = ({
    playlist,
    currentTrack,
    onClickTrack,
}: {
    playlist: PlaylistProps,
    currentTrack: number,
    onClickTrack: (trackId: number) => void,
}) => {
    return (
        <div className="flex flex-col gap-2 max-h-[45vh] overflow-y-scroll">
            {
                playlist.songs.map((track: Song) => {
                        return (
                            <div key={track.id}
                                 onClick={() => onClickTrack(track.id)}
                                 className="flex items-center w-full h-fit p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors cursor-pointer"
                            >
                                <img
                                    className="bg-black text-white w-16 h-16 rounded-lg flex items-center justify-center text-xl font-bold"
                                    src={track.cover!}
                                    alt="cover"
                                />
                                <div className="flex flex-col justify-center px-3">
                                    <h5 className={`text-lg ${currentTrack == track.id ? 'text-teal-400 font-bold' : 'text-white font-semibold'}`}>{track.name}</h5>
                                    <p className="text-sm">{track.artist}</p>
                                </div>
                            </div>
                        );
                    }
                )
            }
        </div>
    );
}
