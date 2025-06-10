import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {ScanEye, Dices, Maximize} from "lucide-react";
import Navbar from "../components/Navbar.tsx";
import Sidebar from "../components/Sidebar.tsx";
import SongQuery from "../components/SongQuery.tsx";

const generateRandomArray = (n: number) => {
    const arr = Array.from({ length: n }, (_, i) => i + 1);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

type algoType = "merge" | "binary" | "quick";

interface Pointer {
    i?: number;
    j?: number;
    pivot?: number;
    low?: number;
    mid?: number;
    high?: number;
    leftStart?: number; // for merge L
    rightStart?: number; // for merge R
    k?: number; // for merge k
}

interface StepSnapshot {
    index: number;
    state: Pointer;
    elements: number[]
}

const SearchSort = () => {
    const [array, setArray] = useState<number[]>(generateRandomArray(10));
    const [arraySize, setArraySize] = useState(10);
    // state for song sort and search
    const [querySize, setQuerySize] = useState(10);
    // state for search term
    const [searchQuery, setSearchQuery] = useState("");

    const [searchDone, setSearchDone] = useState(false);
    const [isSorting, setIsSorting] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<algoType>("merge");
    const [activeIndices, setActiveIndices] = useState<number[]>([]);
    const [searchValue, setSearchValue] = useState<number | "">("");
    const [foundIndex, setFoundIndex] = useState<number | null>(null);
    const [pointers, setPointers] = useState<Pointer>({});
    // State for pivot info (Quick Sort)
    const [pivotInfo, setPivotInfo] = useState<{ value: number; index: number } | null>(null);
    // State for current algorithm state/pointers (for Merge and Binary)
    const [currentAlgoState, setCurrentAlgoState] = useState<Record<string, number | null | boolean | string>>({
        // Initialize all possible states to null/default for initial "-" display
        L: null, R: null, k: null, mid: null, phase: null,
        i: null, j: null, pivot: null,
        low: null, high: null, target: null, status: null,
    });

    // States for metrics
    const [totalSwaps, setTotalSwaps] = useState<number | string>(0);
    const [totalComparisons, setTotalComparisons] = useState<number | string>(0);
    const stopProcessRef = useRef(false);
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

    // Calculate proper height for each elements
    const getHeight = (size: number, val: number): number => {
        let adjust: number;
        let stretchFactor: number;
        switch (size) {
            case 40:
                adjust = 40;
                stretchFactor = 4;
                break;
            case 30:
                adjust = 20;
                stretchFactor = 6;
                break;
            case 20:
                adjust = 30;
                stretchFactor = 8;
                break;
            case 15:
                adjust = 30;
                stretchFactor = 10;
                break;
            case 10:
                adjust = 45;
                stretchFactor = 15;
                break;
            case 5:
                adjust = 50;
                stretchFactor = 30;
                break;
            default:
                stretchFactor = 45;
                adjust = 15;
                break;
        }
        return val * stretchFactor + adjust;
    }

    // Fungsi sleep yang dapat diinterupsi
    const sleep = useCallback((ms: number) => {
        return new Promise<void>((res, rej) => {
            if (stopProcessRef.current) {
                rej(new Error("Process stopped prematurely"));
                return;
            }
            timeoutIdRef.current = setTimeout(() => {
                if (stopProcessRef.current) {
                    rej(new Error("Process stopped during sleep"));
                } else {
                    res();
                }
            }, ms);
        });
    }, []);

    // Fungsi untuk mereset semua state visualisasi (tanpa mengacak array)
    const resetVisualStateOnly = useCallback((algorithm: "merge" | "quick" | "binary") => {
        stopProcessRef.current = true; // Set sinyal penghentian
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current); // Hapus timeout yang tertunda
            timeoutIdRef.current = null;
        }
        setIsSorting(false);
        setFoundIndex(null);
        setSearchDone(false);
        setActiveIndices([]);
        setPointers({});
        setPivotInfo(null); // Reset pivot info
        setCurrentAlgoState({ // Reset current algo state to initial dashes
            L: null, R: null, k: null, mid: null, phase: null,
            i: null, j: null, pivot: null,
            low: null, high: null, target: null, status: null,
        });
        // Reset NEW STATES based on algorithm
        if (algorithm === "quick") {
            setTotalSwaps(0);
        } else { // Merge Sort and Binary Search
            setTotalSwaps('-'); // These don't do swaps in the traditional sense
        }
        setTotalComparisons(0); // Comparisons are relevant for all three

    }, []);

    // Effect untuk melakukan reset saat komponen di-mount atau saat dependensi berubah
    useEffect(() => {
        resetVisualStateOnly(selectedAlgorithm); // Pass current algorithm to ensure correct metric initialization
        const initialArray = generateRandomArray(arraySize);
        setArray(initialArray);
        if (selectedAlgorithm === "binary") {
            setArray([...initialArray].sort((a, b) => a - b));
        }
        stopProcessRef.current = false;

    }, [arraySize, selectedAlgorithm, resetVisualStateOnly]);

    const handleSort = async () => {
        if (isSorting) return;

        resetVisualStateOnly(selectedAlgorithm); // Reset visual state before starting a new sort/search
        stopProcessRef.current = false;
        setIsSorting(true);

        const currentArrayToVisualize = [...array];

        if (selectedAlgorithm === "binary") {
            currentArrayToVisualize.sort((a, b) => a - b);
            setArray([...currentArrayToVisualize]);
        }

        try {
            if (selectedAlgorithm === "merge") {
                await mergeSortVisual(currentArrayToVisualize);
            } else if (selectedAlgorithm === "quick") {
                await quickSortVisual(currentArrayToVisualize, 0, currentArrayToVisualize.length - 1);
            } else { // Binary Search
                await binarySearchVisual(currentArrayToVisualize);
            }
        } catch (error) {
            if (error instanceof Error && error.message.includes("Process stopped")) {
                console.log("Visualisasi dihentikan.");
            } else {
                console.error("Terjadi kesalahan:", error);
            }
        } finally {
            if (!stopProcessRef.current) { // Only reset if not explicitly stopped
                setIsSorting(false);
                setActiveIndices([]);
                setPointers({});
                setPivotInfo(null); // Clear pivot info on completion
                setCurrentAlgoState({ // Clear current algo state on completion to show dashes
                    L: null, R: null, k: null, mid: null, phase: null,
                    i: null, j: null, pivot: null,
                    low: null, high: null, target: null, status: null,
                });
                setSearchDone(true); // Ensure searchDone is true after binary search completes
                // Keep totalSwaps and totalComparisons visible after completion with their final values
            }
        }
    };

    const complexityMap = {
        merge: {
            space: "O(n)",
            time: "O(n log(n))",
        },
        quick: {
            space: "O(log(n))",
            time: "O(n<sup>2</sup>)",
        },
        binary: {
            space: "O(1)",
            time: "O(log(n))",
        },
    };

    const mergeSortVisual = async (arr: number[]) => {
        await mergeSort(arr, 0, arr.length - 1);
    };

    const mergeSort = async (arr: number[], left: number, right: number) => {
        if (stopProcessRef.current) throw new Error("Process stopped");
        if (left >= right) return;

        const mid = Math.floor((left + right) / 2);
        setCurrentAlgoState(prevState => ({ ...prevState, mid: mid, phase: "Dividing" })); // Set mid during division
        await sleep(300);
        await mergeSort(arr, left, mid);
        if (stopProcessRef.current) throw new Error("Process stopped");
        await mergeSort(arr, mid + 1, right);
        if (stopProcessRef.current) throw new Error("Process stopped");
        await merge(arr, left, mid, right);
    };

    const merge = async (arr: number[], left: number, mid: number, right: number) => {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);

        let i = 0;
        let j = 0;
        let k = left;

        while (i < leftArr.length && j < rightArr.length) {
            if (stopProcessRef.current) throw new Error("Process stopped");
            setPointers({
                leftStart: left + i,
                rightStart: mid + 1 + j,
                mid, // Keep mid for context
                k,
            });
            setActiveIndices([left + i, mid + 1 + j, k]);
            setCurrentAlgoState(prevState => ({
                ...prevState,
                L: left + i,
                R: mid + 1 + j,
                k: k,
                mid: mid, // Keep mid for context
                phase: "Merging"
            }));
            setTotalComparisons(prev => Number(prev) + 1); // Increment comparison for (leftArr[i] <= rightArr[j])
            await sleep(300);

            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }
            setArray([...arr]);
            k++;
        }

        while (i < leftArr.length) {
            if (stopProcessRef.current) throw new Error("Process stopped");
            setPointers({
                leftStart: left + i,
                mid,
                k,
            });
            setActiveIndices([left + i, k]);
            setCurrentAlgoState(prevState => ({
                ...prevState,
                L: left + i,
                R: null, // R is no longer active
                k: k,
                mid: mid, // Keep mid for context
                phase: "Merging Leftover"
            }));
            await sleep(300);
            arr[k++] = leftArr[i++];
            setArray([...arr]);
        }

        while (j < rightArr.length) {
            if (stopProcessRef.current) throw new Error("Process stopped");
            setPointers({
                rightStart: mid + 1 + j,
                mid,
                k,
            });
            setActiveIndices([mid + 1 + j, k]);
            setCurrentAlgoState(prevState => ({
                ...prevState,
                L: null, // L is no longer active
                R: mid + 1 + j,
                k: k,
                mid: mid, // Keep mid for context
                phase: "Merging Leftover"
            }));
            await sleep(300);
            arr[k++] = rightArr[j++];
            setArray([...arr]);
        }
    };

    const quickSortVisual = async (arr: number[], low: number, high: number) => {
        if (stopProcessRef.current) throw new Error("Process stopped");
        if (low < high) {
            const pi = await partition(arr, low, high);
            if (stopProcessRef.current) throw new Error("Process stopped");
            await quickSortVisual(arr, low, pi - 1);
            if (stopProcessRef.current) throw new Error("Process stopped");
            await quickSortVisual(arr, pi + 1, high);
        }
    };

    const partition = async (arr: number[], low: number, high: number) => {
        if (stopProcessRef.current) throw new Error("Process stopped");
        const pivot = arr[high];
        setPivotInfo({ value: pivot, index: high });
        let i = low - 1;

        for (let j = low; j < high; j++) {
            if (stopProcessRef.current) throw new Error("Process stopped");
            setPointers({ i, j, pivot: high });
            setActiveIndices([j, high]);
            setCurrentAlgoState(prevState => ({
                ...prevState,
                i: i,
                j: j,
                pivot: high,
                phase: "Partitioning"
            })); // Set Quick Sort specific pointers
            setTotalComparisons(prev => Number(prev) + 1); // Increment comparison for (arr[j] < pivot)
            await sleep(300);

            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                setTotalSwaps(prev => Number(prev) + 1); // Increment swap
                setArray([...arr]);
                setCurrentAlgoState(prevState => ({
                    ...prevState,
                    i: i,
                    j: j,
                    pivot: high,
                    phase: "Swapping"
                })); // Update after swap
                await sleep(300);
            }
        }

        // Final swap of pivot
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        setTotalSwaps(prev => Number(prev) + 1); // Increment swap for final pivot placement
        setArray([...arr]);
        setCurrentAlgoState(prevState => ({
            ...prevState,
            i: i + 1,
            j: null, // j is no longer active after loop
            pivot: high,
            phase: "Final Swap"
        })); // Final swap
        await sleep(300);
        // setPivotInfo(null); // Clear pivot info after partition - handled by final reset
        // setCurrentAlgoState({}); // Clear Quick Sort state after partition - handled by final reset
        return i + 1;
    };

    const binarySearchVisual = async (arr: number[]) => {
        if (typeof searchValue !== "number" || isNaN(searchValue)) {
            setSearchDone(true);
            setCurrentAlgoState(prevState => ({
                ...prevState,
                status: "Invalid Input",
                target: searchValue // Still show invalid input if any
            }));
            return;
        }

        let left = 0;
        let right = arr.length - 1;

        while (left <= right) {
            if (stopProcessRef.current) throw new Error("Process stopped");
            const mid = Math.floor((left + right) / 2);

            setActiveIndices([left, mid, right]);
            setPointers({ low: left, mid: mid, high: right });
            setCurrentAlgoState(prevState => ({ ...prevState, low: left, mid: mid, high: right, target: searchValue, status: "Searching" }));
            await sleep(500);

            setTotalComparisons(prev => Number(prev) + 1); // For arr[mid] === searchValue
            if (arr[mid] === searchValue) {
                setFoundIndex(mid);
                setActiveIndices([mid]);
                setPointers({ mid });
                setCurrentAlgoState(prevState => ({ ...prevState, low: null, mid: mid, high: null, target: searchValue, status: "Found" }));
                setSearchDone(true);
                return;
            } else if (arr[mid] < searchValue) {
                // No additional comparison count here if using if-else if structure,
                // as the first comparison already covers the check.
                // If it were separate 'if (arr[mid] < searchValue)' and 'if (arr[mid] > searchValue)'
                // then you'd count each check. Let's keep it clean as one comparison per pass.
                left = mid + 1;
                setCurrentAlgoState(prevState => ({ ...prevState, low: left, mid: mid, high: right, target: searchValue, status: "Adjusting Low" }));
            } else {
                // No additional comparison count here.
                right = mid - 1;
                setCurrentAlgoState(prevState => ({ ...prevState, low: left, mid: mid, high: right, target: searchValue, status: "Adjusting High" }));
            }
        }
        setFoundIndex(null);
        setCurrentAlgoState(prevState => ({ ...prevState, low: null, mid: null, high: null, target: searchValue, status: "Not Found" }));
        setSearchDone(true);
    };

    // Handle algorithm select
    const handleAlgorithmChange = (algo: "merge" | "quick" | "binary") => {
        resetVisualStateOnly(algo); // Pass the new algorithm to reset metrics correctly
        setSelectedAlgorithm(algo);
        const newArray = generateRandomArray(arraySize);
        setArray(newArray);

        if (algo === "binary") {
            setArray([...newArray].sort((a, b) => a - b));
        }
        setSearchValue("");
    };

    // Handler untuk perubahan ukuran array
    const handleArraySizeChange = (newSize: number) => {
        resetVisualStateOnly(selectedAlgorithm); // Reset with current algorithm context
        setArraySize(newSize);
        const newArray = generateRandomArray(newSize);
        setArray(newArray);

        if (selectedAlgorithm === "binary") {
            setArray([...newArray].sort((a, b) => a - b));
        }
        setSearchValue("");
    };

    // Handler untuk input pencarian
    const handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const num = value === "" ? "" : Number(value);
        setSearchValue(num);
        resetVisualStateOnly(selectedAlgorithm); // Reset with current algorithm context
    };

    // useEffect untuk cleanup saat komponen unmount
    useEffect(() => {
        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };
    }, []);

    // Fungsi helper untuk render nilai pointer atau "-"
    const renderPointerValue = (key: string) => {
        const value = currentAlgoState[key];
        if (value === null || value === undefined || value === "") { // Also check for empty string for searchValue
            return "-";
        }
        // Special handling for boolean status in binary search
        if (key === "found" && typeof value === 'boolean') {
            return value ? "Yes" : "No";
        }
        // If it's a number and a valid array index, show value from array too
        if (typeof value === 'number' && array[value] !== undefined) {
            return `${value} (Val: ${array[value]})`;
        }
        return value.toString(); // For string values like phase or status, or numbers not representing indices
    };

    // playback controls components
    const [history, setHistory] = useState<StepSnapshot[]>();
    const [isPlaybackMode, setIsPlaybackMode] = useState<boolean>(false);

    return (
        <section
            className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            <Navbar onSearch={setSearchQuery}/>
            <div className="flex">
                {/* sidebar */}
                <Sidebar/>

                {/* main content */}
                <div className="flex-1 grid grid-cols-3 gap-6 p-6">
                    <div className="col-span-2 space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2 text-lg">
                                <span>Search</span>
                                <span>/</span>
                                <span className="font-semibold">Sort</span>
                            </div>
                        </div>

                        {/* Render songs search and sort */}
                        <SongQuery
                            songQueryProps={{
                                querySize: querySize,
                                onChangeQuerySize: setQuerySize,
                                onSearch: setSearchQuery,
                                searchTerm: searchQuery,
                            }}
                        />
                        {/* Visualization Compenent */}

                        <div className="bg-white/5 rounded-xl p-5 space-y-10 flex flex-col">
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-semibold">Visualization</span>
                                <div className="flex gap-2">
                                    <button
                                        disabled={isSorting}
                                        onClick={handleSort}
                                        className={`px-4 py-2 flex items-center gap-2 font-medium rounded-xl text-lg hover:cursor-pointer ${
                                            isSorting ? "bg-white/20 cursor-not-allowed" : "bg-white/10 hover:bg-white/20"
                                        }`}
                                    >
                                        <ScanEye size={18}/>
                                        {isSorting ? "Sorting..." : "Visualize"}
                                    </button>
                                    <select
                                        value={arraySize}
                                        onChange={(e) => setArraySize(parseInt(e.target.value))}
                                        className="bg-cyan-700 px-3 py-2 rounded-lg text-base text-white w-full sm:w-auto"
                                    >
                                        {[5, 10, 15, 20, 30, 40].map((size) => (
                                            <option key={size} value={size}>
                                                n = {size}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="ms-auto flex items-center gap-2">
                                {["merge", "quick", "binary"].map((algo) => (
                                    <label key={algo} className="relative cursor-pointer">
                                        <input
                                            type="radio"
                                            name="algo"
                                            value={algo}
                                            checked={selectedAlgorithm === algo}
                                            onChange={() => handleAlgorithmChange(algo as algoType)}
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
                                {selectedAlgorithm === "binary" && (
                                    <input
                                        type="number"
                                        value={searchValue}
                                        onChange={handleSearchValueChange}
                                        placeholder="Cari angka..."
                                        className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                )}
                            </div>

                            {/* Conditional message display based on selectedAlgorithm and state */}
                            <div className="text-center text-sm text-white/80 mt-4">
                                {selectedAlgorithm === "binary" ? (
                                    // Binary Search Messages
                                    searchValue === "" ? (
                                        "Masukkan angka yang ingin dicari."
                                    ) : isSorting ? (
                                        `Mencari angka ${searchValue}...`
                                    ) : searchDone ? (
                                        foundIndex !== null
                                            ? `Angka ${searchValue} ditemukan di indeks ${foundIndex}.`
                                            : `Angka ${searchValue} tidak ditemukan.`
                                    ) : (
                                        // Default message when binary search is selected but not started
                                        `Bersiap mencari angka ${searchValue}. Klik 'Visualize' untuk memulai.`
                                    )
                                ) : (
                                    // Merge Sort and Quick Sort Messages
                                    isSorting ? (
                                        `Proses sorting berjalan...`
                                    ) : (
                                        // Default message when sort algorithm is selected and not started
                                        "Klik 'Visualize' untuk memulai sorting."
                                    )
                                )}
                            </div>
                            {/* Render elements */}
                            <div className="flex items-end justify-between h-40 space-x-1 sm:space-x-2 relative">
                                {array.map((value, index) => (
                                    <motion.div
                                        layout
                                        key={value}
                                        className={`relative flex justify-center items-end rounded-md
                                            ${
                                            selectedAlgorithm === "binary" && searchDone && foundIndex === index
                                                ? "bg-green-500 border-2 border-green-300 scale-110" // Green for found item
                                                : activeIndices.includes(index)
                                                    ? "bg-yellow-400 border-2 border-yellow-200 scale-105"
                                                    : "bg-gradient-to-br from-indigo-500 to-pink-500 hover:brightness-110"
                                        }`}
                                        transition={{layout: {duration: 0.3}}}
                                        style={{
                                            // adjust bar height
                                            height: `${getHeight(arraySize, value)}px`,
                                            width: `min(max(${100 / array.length}%, 30px), 80px)`,
                                        }}
                                    >
                                        {/* Pointer labels for merge */}
                                        {selectedAlgorithm === "merge" && (
                                            <>
                                                {pointers.leftStart === index && (
                                                    <span
                                                        className="absolute -top-7 text-sm font-semibold bg-green-600 text-white px-2 py-1 rounded-md shadow-md"
                                                    >L</span>
                                                )}
                                                {pointers.rightStart === index && (
                                                    <span
                                                        className="absolute -top-7 text-sm font-semibold bg-blue-600 text-white px-2 py-1 rounded-md shadow-md"
                                                    >R</span>
                                                )}
                                                {pointers.k === index && (
                                                    <span
                                                        className="absolute -top-7 text-sm font-semibold bg-yellow-600 text-black px-2 py-1 rounded-md shadow-md"
                                                    >k</span>
                                                )}
                                            </>
                                        )}
                                        {/* Pointer labels for quick */}
                                        {selectedAlgorithm === "quick" && (
                                            <>
                                                {pointers.i === index && (
                                                    <span
                                                        className="absolute -top-7 text-sm font-semibold bg-green-600 text-white px-2 py-1 rounded-md shadow-md"
                                                    >i</span>
                                                )}
                                                {pointers.j === index && (
                                                    <span
                                                        className="absolute -top-7 text-sm font-semibold bg-blue-600 text-white px-2 py-1 rounded-md shadow-md"
                                                    >j</span>
                                                )}
                                                {pointers.pivot === index && (
                                                    <span
                                                        className="absolute -top-7 text-sm font-semibold bg-red-600 text-white px-2 py-1 rounded-md shadow-md"
                                                    >pivot</span>
                                                )}
                                            </>
                                        )}
                                        {/* Pointer labels for binary */}
                                        {selectedAlgorithm === "binary" && (
                                            <>
                                                {pointers.low === index && (
                                                    <span
                                                        className="absolute -top-7 text-sm font-semibold bg-green-600 text-white px-2 py-1 rounded-md shadow-md"
                                                    >low</span>
                                                )}
                                                {pointers.mid === index && (
                                                    <span
                                                        className="absolute -top-7 text-sm font-semibold bg-blue-600 text-white px-2 py-1 rounded-md shadow-md"
                                                    >mid</span>
                                                )}
                                                {pointers.high === index && (
                                                    <span
                                                        className="absolute -top-7 text-sm font-semibold bg-red-600 text-white px-2 py-1 rounded-md shadow-md"
                                                    >high</span>
                                                )}
                                            </>
                                        )}

                                        {/* Bar value */}
                                        <span className="block text-base font-semibold text-white">{value}</span>
                                    </motion.div>
                                ))}
                            </div>
                            {/* Reset array elements */}
                            <button onClick={() => {
                                resetVisualStateOnly(selectedAlgorithm);
                                const newArray = generateRandomArray(arraySize);
                                setArray(newArray);
                                if (selectedAlgorithm === "binary") {
                                    setArray([...newArray].sort((a, b) => a - b));
                                }
                                setSearchValue("");
                            }}
                                    className="flex gap-2 items-center w-fit text-black px-4 py-2 rounded-xl font-medium hover:cursor-pointer bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/25 text-lg"
                            >
                                <Dices size={18}/>
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Complexity Component */}
                    <div className="space-y-6">
                        <div className="bg-white/5 rounded-xl p-4">
                            <h4 className="text-xl mb-2 font-semibold">Space Complexity</h4>
                            <div className="bg-cyan-700 text-purple-300 px-4 py-2 rounded-lg text-center font-semibold">
                                {complexityMap[selectedAlgorithm].space}
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                            <h4 className="text-xl mb-2 font-semibold">Time Complexity</h4>
                            <div
                                className="bg-cyan-700 text-purple-300 px-4 py-2 rounded-lg text-center font-semibold"
                                dangerouslySetInnerHTML={{ __html: complexityMap[selectedAlgorithm].time }}
                            >
                            </div>
                        </div>

                        {/* Algorithm State Component */}
                        <div className="bg-white/10 border border-orange-400 rounded-xl p-4 min-w-[200px]">
                            <h4 className="text-xl font-semibold mb-2 text-orange-300">
                                {selectedAlgorithm === "quick" ? "Current Pivot" : "Current Pointers"}
                            </h4>
                            <div className="space-y-2 text-base">
                                {selectedAlgorithm === "quick" && (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-white/70">Pivot Value:</span>
                                            <span className="font-bold text-orange-300">{pivotInfo?.value ?? '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/70">Pivot Index:</span>
                                            <span className="font-bold text-orange-300">{pivotInfo?.index ?? '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/70">i:</span>
                                            <span className="font-bold text-orange-300">{renderPointerValue('i')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/70">j:</span>
                                            <span className="font-bold text-orange-300">{renderPointerValue('j')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/70">Phase:</span>
                                            <span className="font-bold text-orange-300">{renderPointerValue('phase')}</span>
                                        </div>
                                    </>
                                )}

                                {selectedAlgorithm === "merge" && (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-white/70">L:</span>
                                            <span className="font-bold text-orange-300">{renderPointerValue('L')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/70">R:</span>
                                            <span className="font-bold text-orange-300">{renderPointerValue('R')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/70">k:</span>
                                            <span className="font-bold text-orange-300">{renderPointerValue('k')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/70">Mid:</span>
                                            <span className="font-bold text-orange-300">{renderPointerValue('mid')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/70">Phase:</span>
                                            <span className="font-bold text-orange-300">{renderPointerValue('phase')}</span>
                                        </div>
                                    </>
                                )}

                                {selectedAlgorithm === "binary" && (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-white/70">Target:</span>
                                            <span className="font-bold text-orange-300">{renderPointerValue('target')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/70">Low:</span>
                                            <span className="font-bold text-orange-300">{renderPointerValue('low')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/70">Mid:</span>
                                            <span className="font-bold text-orange-300">{renderPointerValue('mid')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/70">High:</span>
                                            <span className="font-bold text-orange-300">{renderPointerValue('high')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/70">Status:</span>
                                            <span className={`font-bold ${
                                                currentAlgoState.status === "Found" ? 'text-green-400' :
                                                    currentAlgoState.status === "Not Found" || currentAlgoState.status === "Invalid Input" ? 'text-red-400' :
                                                        'text-orange-300'
                                            }`}>
                                                    {renderPointerValue('status')}
                                                </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Performance Metric Component */}
                        <div className="bg-white/10 border border-purple-400 rounded-xl p-4 min-w-[200px]">
                            <h4 className="text-xl font-semibold mb-2 text-purple-300">
                                Metrics
                            </h4>
                            <div className="space-y-2 text-base">
                                <div className="flex justify-between">
                                    <span className="text-white/70">Total Swaps:</span>
                                    {/* Display based on algorithm */}
                                    <span className="font-bold text-purple-300">
                                        {totalSwaps}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/70">Total Comparisons:</span>
                                    <span className="font-bold text-purple-300">{totalComparisons}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SearchSort;