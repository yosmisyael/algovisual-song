import type {AlbumProps} from "../types/AlbumProp.ts";

export const Albums = ({ albums }: {albums: AlbumProps[]}   ) => (
    <>
        {albums.map((album, index) => (
            <div key={album.id} className="flex items-center space-x-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                <div className={`w-16 h-16 ${album.color} rounded-lg flex items-center justify-center`}>
                    {index === 0 && <div className="w-8 h-8 bg-black/20 rounded"></div>}
                    {index === 1 && <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center text-xl font-bold">X</div>}
                    {index === 2 && <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-purple-600 rounded"></div>}
                    {index === 3 && <div className="w-8 h-8 bg-black rounded grid grid-cols-2 gap-1 p-1">
                        <div className="bg-white rounded-full"></div>
                        <div className="bg-white rounded-full"></div>
                        <div className="bg-white rounded-full"></div>
                        <div className="bg-white rounded-full"></div>
                    </div>}
                    {index === 4 && <div className="w-8 h-8 bg-yellow-800 rounded flex items-center justify-center">
                        <div className="w-4 h-6 bg-black"></div>
                    </div>}
                </div>
                <div className="flex-1 h-16 bg-slate-600 rounded-lg"></div>
            </div>
        ))}
    </>
)
