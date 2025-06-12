export const Lyrics = ({ lyrics }: { lyrics: string[] }) => {
    return (
        <div className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm h-[30vh] overflow-hidden">
            <h3 className="text-xl font-semibold mb-4">Song Lyrics</h3>
                <div className="space-y-2 text-sm text-white/70 max-h-80 overflow-y-auto">
            { lyrics.map((line, index) => (
                <div key={index} className={`${line === "" ? "h-2" : ""} text-lg font-semibold hover:text-white hover:font-bold hover:cursor-pointer`}>
                    {line}
                </div>
            ))}
            </div>
        </div>
    )
}