import {useState} from "react";

const EqualizerControl = () => {
    const equalizerBands = [32, 64, 125, 250, 500, '1K', '2K', '4K', '8K', '16K'];
    const [equalizerValues, setEqualizerValues] = useState([
        100, 40, 60, 80, 70, 90, 85, 75, 65, 55
    ]);

    return (
        <div className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Setting Equalizer</h3>
        </div>

        <div className="flex justify-between items-end space-x-2 mb-4">
            {equalizerBands.map((band, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                    <div className="h-32 w-4 bg-slate-700 rounded-full relative overflow-hidden">
                        <div
                            className="absolute bottom-0 w-full bg-gradient-to-t from-teal-400 to-blue-400 rounded-full transition-all duration-300"
                            style={{ height: `${equalizerValues[index]}%` }}
                        ></div>
                        <div
                            className="absolute w-6 h-6 bg-white rounded-full shadow-lg cursor-pointer transform -translate-x-1"
                            style={{ bottom: `${equalizerValues[index]}%`, transform: 'translateX(-25%) translateY(50%)' }}
                        ></div>
                    </div>
                    <span className="text-xs text-white/50">{band}</span>
                </div>
            ))}
        </div>

        <div className="flex justify-center space-x-2">
            <button className="px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors">Custom</button>
            <button className="px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors">Normal</button>
            <button className="px-4 py-2 bg-teal-500 rounded-full text-sm text-black font-medium">Pop</button>
            <button className="px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors">Classic</button>
            <button className="px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors">Heavy M</button>
        </div>
    </div>
    );
}

export default EqualizerControl;