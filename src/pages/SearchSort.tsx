import { useState } from "react";
import { motion } from "framer-motion";
import { ScanEye, Dices, Maximize } from "lucide-react";
import SearchSortBar from "../components/SearchSortBar.tsx";
import Sidebar from "../components/Sidebar.tsx";

const generateRandomArray = (n: number) => {
    const arr = Array.from({ length: n }, (_, i) => i + 4);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

type visualization = "merge" | "quick" | "binary";

const SearchSort = () => {
    const [array, setArray] = useState<number[]>(generateRandomArray(10));
    const [isSorting, setIsSorting] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<visualization>("merge");
    const [activeIndices, setActiveIndices] = useState<number[]>([]);
    const [pivotInfo, setPivotInfo] = useState<{ value: number; index: number } | null>(null);

    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const handleSort = async () => {
        setIsSorting(true);
        const arr = [...array];

        if (selectedAlgorithm === "merge") {
            await mergeSortVisual(arr);
        } else if (selectedAlgorithm === "quick") {
            await quickSortVisual(arr, 0, arr.length - 1);
        } else {
            await binarySortVisual(arr);
        }

        setIsSorting(false);
        setActiveIndices([]);
        setPivotInfo(null);
    };

    const mergeSortVisual = async (arr: number[]) => {
        const mergeSort = async (start: number, end: number) => {
            if (start >= end) return;
            const mid = Math.floor((start + end) / 2);
            await mergeSort(start, mid);
            await mergeSort(mid + 1, end);

            const merged: number[] = [];
            let i = start,
                j = mid + 1;

            while (i <= mid && j <= end) {
                setActiveIndices([i, j]);
                await sleep(200);
                if (arr[i] < arr[j]) merged.push(arr[i++]);
                else merged.push(arr[j++]);
            }
            while (i <= mid) merged.push(arr[i++]);
            while (j <= end) merged.push(arr[j++]);

            for (let k = 0; k < merged.length; k++) {
                arr[start + k] = merged[k];
                setActiveIndices([start + k]);
                setArray([...arr]);
                await sleep(300);
            }
        };

        await mergeSort(0, arr.length - 1);
    };

    const quickSortVisual = async (arr: number[], low: number, high: number) => {
        if (low < high) {
            const pi = await partition(arr, low, high);
            await quickSortVisual(arr, low, pi - 1);
            await quickSortVisual(arr, pi + 1, high);
        }
    };

    const partition = async (arr: number[], low: number, high: number) => {
        const pivot = arr[high];
        setPivotInfo({ value: pivot, index: high });
        let i = low - 1;

        for (let j = low; j < high; j++) {
            setActiveIndices([j, high]);
            await sleep(300);
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                setArray([...arr]);
                await sleep(300);
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        setArray([...arr]);
        await sleep(300);
        return i + 1;
    };

    const binarySortVisual = async (arr: number[]) => {
        const reversed = [...arr].sort((a, b) => b - a);
        for (let i = 0; i < reversed.length; i++) {
            arr[i] = reversed[i];
            setArray([...arr]);
            setActiveIndices([i]);
            await sleep(150);
        }
    };

    const handleReset = () => {
        setArray(generateRandomArray(10));
        setPivotInfo(null);
    };

    return (
        <section className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* top bar */}
            <SearchSortBar />
            {/* content */}
            <div className="flex">
                {/* sidebar content */}
                <Sidebar />
                {/* main content */}
                <div className="flex-1 grid grid-cols-3 gap-6 p-6">
                    <div className="col-span-2 space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2 text-lg">
                                <span>Search</span>
                                <span>/</span>
                                <span className="font-semibold">Sort</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                {["merge", "quick", "binary"].map((algo) => (
                                    <label key={algo} className="relative cursor-pointer">
                                        <input
                                            type="radio"
                                            name="algo"
                                            value={algo}
                                            checked={selectedAlgorithm === algo}
                                            onChange={() => setSelectedAlgorithm(algo as visualization)}
                                            className="sr-only"
                                        />
                                        <div className={`px-4 py-2 text-lg rounded-xl font-medium transition-all duration-200 ${
                                            selectedAlgorithm === algo
                                                ? "bg-red-600 text-white shadow-lg shadow-red-600/30 border-2 border-red-400"
                                                : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border-2 border-transparent"
                                        }`}>
                                            {algo[0].toUpperCase() + algo.slice(1)}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 border border-blue-500 rounded-xl p-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-semibold">Result</span>
                                <button
                                    onClick={() => setArray(generateRandomArray(10))}
                                    className="bg-cyan-700 px-3 py-1 rounded-lg text-sm"
                                >
                                    n = 10
                                </button>
                            </div>
                            <button className="flex gap-2 items-center hover:cursor-pointer hover:bg-yellow-400 bg-yellow-300 text-black px-4 py-2 rounded-xl">
                                <Maximize size={18} />
                                Full View
                            </button>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-semibold">Visualization</span>
                                <button
                                    disabled={isSorting}
                                    onClick={handleSort}
                                    className={`px-4 py-2 flex items-center gap-2 font-medium rounded-xl text-lg hover:cursor-pointer ${
                                        isSorting ? "bg-white/20 cursor-not-allowed" : "bg-white/10 hover:bg-white/20"
                                    }`}
                                >
                                    <ScanEye size={18} />
                                    {isSorting ? "Sorting..." : "Visualize"}
                                </button>
                            </div>

                            <div className="flex items-end justify-between h-40 space-x-2 relative">
                                {array.map((value, index) => (
                                    <motion.div
                                        layout
                                        key={value}
                                        className={`w-20 rounded-md flex justify-center items-end ${
                                            activeIndices.includes(index)
                                                ? "bg-yellow-400 border-2 border-yellow-200 scale-105"
                                                : "bg-gradient-to-br from-indigo-500 to-pink-500 hover:brightness-110"
                                        }`}
                                        transition={{ layout: { duration: 0.3 } }}
                                        style={{ height: `${value * 12}px` }}
                                    >
                                        <span className="block text-xl font-semibold">{value}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex justify-between items-start">
                                <button onClick={handleReset} className="flex gap-2 items-center bg-yellow-300 text-black px-4 py-2 rounded-xl font-medium hover:cursor-pointer hover:bg-yellow-400 text-lg">
                                    <Dices size={18} />
                                    Reset
                                </button>

                                {selectedAlgorithm === "quick" && pivotInfo && isSorting && (
                                    <div className="bg-white/10 border border-orange-400 rounded-xl p-4 min-w-[200px]">
                                        <h4 className="text-lg font-semibold mb-2 text-orange-300">Current Pivot</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-white/70">Value:</span>
                                                <span className="font-bold text-orange-300">{pivotInfo.value}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/70">Index:</span>
                                                <span className="font-bold text-orange-300">{pivotInfo.index}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white/5 rounded-xl p-4">
                            <h4 className="text-xl mb-2 font-semibold">Space Complexity</h4>
                            <div className="bg-cyan-700 text-purple-300 px-4 py-2 rounded-lg text-center font-semibold">
                                O(n)
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                            <h4 className="text-xl mb-2 font-semibold">Time Complexity</h4>
                            <div className="bg-cyan-700 text-purple-300 px-4 py-2 rounded-lg text-center font-semibold">
                                O(n log n)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SearchSort;