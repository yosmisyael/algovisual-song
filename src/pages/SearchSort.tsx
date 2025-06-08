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

const SearchSort = () => {
    const [array, setArray] = useState<number[]>(generateRandomArray(10));
    const [isSorting, setIsSorting] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<"merge" | "quick" | "binary">("merge");
    const [activeIndices, setActiveIndices] = useState<number[]>([]);

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
        let i = low - 1;

        for (let j = low; j < high; j++) {
            setActiveIndices([j, high]);
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
    };

    return (
        <section className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            <SearchSortBar />
            <div className="flex">
                <Sidebar />

                <div className="flex-1 grid grid-cols-3 gap-6 p-6">
                    <div className="col-span-2 space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2 text-lg">
                                <span>Search</span>
                                <span>/</span>
                                <span className="font-semibold">Sort</span>
                            </div>

                            <div className="flex items-center space-x-4">
                                {["merge", "quick", "binary"].map((algo) => (
                                    <label key={algo} className="flex items-center gap-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="algo"
                                            value={algo}
                                            checked={selectedAlgorithm === algo}
                                            onChange={() => setSelectedAlgorithm(algo as any)}
                                        />
                                        <span className={`text-sm ${selectedAlgorithm === algo ? "text-white" : "text-white/50"}`}>
                      {algo[0].toUpperCase() + algo.slice(1)}
                    </span>
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
                            <button onClick={handleReset} className="flex gap-2 items-center bg-yellow-300 text-black px-4 py-2 rounded-xl font-medium hover:cursor-pointer hover:bg-yellow-400 text-lg">
                                <Dices size={18} />
                                Reset
                            </button>
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