import { Maximize, X, BarChart3, Clock, ArrowUpDown, Search as SearchIcon, Filter } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import {SortingAlgorithms} from "../lib/sort-service.ts";
import {SearchAlgorithms} from "../lib/search-service.ts";
import type {Song, AlgorithmState, SongQueryProps, SortMetrics, SearchMetrics} from "../types/SongQueryProp.ts";
import {fetchApiData} from "../lib/api.ts";



// Mock data for demonstration
const mockTracks: Song[] = [
    { id: 1, name: "Whiplash", artist: "aespa", year: 2024 },
    { id: 2, name: "Supernova", artist: "aespa", year: 2024 },
    { id: 3, name: "Armageddon", artist: "aespa", year: 2024 },
    { id: 4, name: "Drama", artist: "aespa", year: 2023 },
    { id: 5, name: "Spicy", artist: "aespa", year: 2023 },
    { id: 6, name: "Girls", artist: "aespa", year: 2022 },
    { id: 7, name: "Savage", artist: "aespa", year: 2021 },
    { id: 8, name: "Next Level", artist: "aespa", year: 2021 },
    { id: 9, name: "Black Mamba", artist: "aespa", year: 2020 },
    { id: 10, name: "Forever", artist: "aespa", year: 2021 }
];

// Main SongQuery Component
const SongQuery = ({ songQueryProps }: { songQueryProps: SongQueryProps }) => {
    const [algorithmState, setAlgorithmState] = useState<AlgorithmState>({
        originalData: [],
        currentData: [],
        lastSort: null,
        lastSearch: null,
        isLoading: true,
        error: null
    });
    const [showModal, setShowModal] = useState(false);
    const [sortField, setSortField] = useState<'id' | 'name' | 'artist' | 'year'>('id');
    const [sortAlgorithm, setSortAlgorithm] = useState<'quickSort' | 'mergeSort'>('quickSort');

    // effect to fetch data
    useEffect(() => {
        const fetchTracks = async () => {
            try {
                setAlgorithmState(prev => ({ ...prev, isLoading: true, error: null }));

                const response: Song[] = await fetchApiData('http://localhost:3000/data') as Song[] ?? [] as Song[];

                setAlgorithmState(prev => ({
                    ...prev,
                    originalData: response,
                    currentData: response,
                    isLoading: false
                }));
            } catch (err) {
                setAlgorithmState(prev => ({
                    ...prev,
                    error: "Failed to load tracks",
                    isLoading: false,
                    originalData: [],
                    currentData: []
                }));
                console.error(err);
            }
        };

        fetchTracks();
    }, []);

    // Sorting functions
    const performSort = useCallback((algorithm: 'quickSort' | 'mergeSort', field: keyof Song) => {
        const startTime = performance.now();
        const metrics = { swaps: 0, comparisons: 0 };

        let sortedData: Song[];
        if (algorithm === 'quickSort') {
            sortedData = SortingAlgorithms.quickSort([...algorithmState.currentData], field, metrics);
        } else {
            sortedData = SortingAlgorithms.mergeSort([...algorithmState.currentData], field, metrics);
        }

        const endTime = performance.now();

        const sortMetrics: SortMetrics = {
            algorithm,
            field: field as 'id' | 'name' | 'artist' | 'year',
            swaps: metrics.swaps,
            comparisons: metrics.comparisons,
            timeMs: endTime - startTime,
            resultData: sortedData
        };

        setAlgorithmState(prev => ({
            ...prev,
            currentData: sortedData,
            lastSort: sortMetrics
        }));
    }, [algorithmState.currentData]);

    // Search function
    const performSearch = useCallback((searchTerm: string) => {
        const startTime = performance.now();
        console.log(algorithmState.originalData)
        const metrics = { comparisons: 0 };

        // Determine if search term is numeric (for ID search) or string (for name search)
        const isNumeric = !isNaN(Number(searchTerm));
        const field: 'id' | 'name' = isNumeric ? 'id' : 'name';
        const searchValue = isNumeric ? Number(searchTerm) : searchTerm;

        const result = SearchAlgorithms.binarySearch(algorithmState.originalData, searchValue, field, metrics);
        const endTime = performance.now();

        const searchMetrics: SearchMetrics = {
            algorithm: 'binarySearch',
            field,
            searchTerm,
            comparisons: metrics.comparisons,
            timeMs: endTime - startTime,
            resultData: result,
            found: result !== null
        };

        setAlgorithmState((prev: AlgorithmState) => ({
            ...prev,
            lastSearch: searchMetrics,
            currentData: result ? [result] : []
        }));
    }, [algorithmState.originalData]);

    useEffect(() => {
        if (algorithmState.originalData.length > 0 && songQueryProps.searchTerm) {
            performSearch(songQueryProps.searchTerm);
        }
    }, [songQueryProps.searchTerm, performSearch]);

    // Reset to original data
    const resetData = () => {
        setAlgorithmState(prev => ({
            ...prev,
            currentData: prev.originalData,
            lastSort: null,
            lastSearch: null
        }));
    };

    const displayedTracks = songQueryProps.querySize === 'all'
        ? algorithmState.currentData
        : algorithmState.currentData.slice(0, songQueryProps.querySize as number);

    const MetricCard = ({ title, value, unit, icon: Icon, color = "purple" }: any) => (
        <div className={`bg-gradient-to-br from-${color}-800/50 to-${color}-900/50 backdrop-blur-sm rounded-lg p-4 border border-${color}-500/30`}>
            <div className="flex items-center gap-3 mb-2">
                <Icon className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-medium text-gray-300">{title}</h4>
            </div>
            <div className="text-2xl font-bold text-white">
                {typeof value === 'number' ? value.toFixed(unit === 'ms' ? 2 : 0) : value || 'N/A'}
                <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
            </div>
        </div>
    );

    if (algorithmState.isLoading) {
        return <div className="text-white text-center py-8">Loading tracks...</div>;
    }

    if (algorithmState.error) {
        return <div className="text-red-400 text-center py-8">{algorithmState.error}</div>;
    }

    return (
        <>
            <div className={`transition-all duration-300 ${showModal ? 'blur-sm brightness-50' : ''}`}>
                <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 mt-4">
                    {/* Component heading */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-white">Result</h2>
                        <div className="flex flex-wrap gap-2">
                            {/* Sort Controls */}
                            <select
                                value={sortField}
                                onChange={(e) => setSortField(e.target.value as any)}
                                className="bg-cyan-700 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value="id">Sort by ID</option>
                                <option value="name">Sort by Title</option>
                                <option value="artist">Sort by Artist</option>
                                <option value="year">Sort by Year</option>
                            </select>

                            <select
                                value={sortAlgorithm}
                                onChange={(e) => setSortAlgorithm(e.target.value as any)}
                                className="bg-cyan-700 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value="quickSort">Quick Sort</option>
                                <option value="mergeSort">Merge Sort</option>
                            </select>

                            <button
                                onClick={() => performSort(sortAlgorithm, sortField)}
                                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm text-white transition-colors"
                            >
                                Sort
                            </button>

                            <button
                                onClick={resetData}
                                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm text-white transition-colors"
                            >
                                Reset
                            </button>

                            <select
                                value={songQueryProps.querySize}
                                onChange={(e) => songQueryProps.onChangeQuerySize(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                                className="bg-cyan-700 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                {[10, 20, 30, 50].map((size) => (
                                    <option key={size} value={size}>n = {size}</option>
                                ))}
                                <option value={130}>all</option>
                            </select>
                        </div>
                    </div>

                    {/* Component content */}
                    <div className="overflow-x-auto mb-6">
                        <div className="bg-black/20 rounded-lg border border-purple-500/20">
                            <div className="grid grid-cols-4 gap-4 p-4 border-b border-purple-500/20 bg-purple-800/30">
                                <div className="font-semibold text-gray-300">Track ID</div>
                                <div className="font-semibold text-gray-300">Title</div>
                                <div className="font-semibold text-gray-300">Artist</div>
                                <div className="font-semibold text-gray-300">Year</div>
                            </div>
                            <div className="h-[10vh]">
                                {displayedTracks.length > 0 ? displayedTracks.map((track, index) => (
                                    <div key={track.id} className={`grid grid-cols-4 gap-4 p-4 ${index % 2 === 0 ? 'bg-purple-900/20' : 'bg-purple-800/10'} hover:bg-purple-700/30 transition-colors`}>
                                        <div className="text-white">{track.id}</div>
                                        <div className="text-white">{track.name}</div>
                                        <div className="text-cyan-400">{track.artist}</div>
                                        <div className="text-gray-300">{track.year}</div>
                                    </div>
                                )) : (
                                    <div className="p-8 text-center text-gray-400">
                                        {algorithmState.lastSearch && !algorithmState.lastSearch.found
                                            ? `No results found for "${algorithmState.lastSearch.searchTerm}"`
                                            : "No data to display"
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Component footer */}
                    <div className="flex justify-center">
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-yellow-500/25"
                        >
                            <Maximize className="w-4 h-4" />
                            Full View
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />

                    <div className="relative bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-xl rounded-2xl border border-purple-500/30 w-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
                            <h2 className="text-3xl font-bold text-white">Algorithm Performance Analysis</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-purple-800/50 rounded-lg transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                            {/* Algorithm Metrics Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                {/* Sort Metrics */}
                                {algorithmState.lastSort && (
                                    <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-500/30">
                                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                            <ArrowUpDown className="w-5 h-5 text-blue-400" />
                                            {algorithmState.lastSort.algorithm === 'quickSort' ? 'Quick Sort' : 'Merge Sort'} Performance
                                        </h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            <MetricCard
                                                title="Total Swaps"
                                                value={algorithmState.lastSort.swaps}
                                                unit="swaps"
                                                icon={ArrowUpDown}
                                                color="blue"
                                            />
                                            <MetricCard
                                                title="Comparisons"
                                                value={algorithmState.lastSort.comparisons}
                                                unit="ops"
                                                icon={BarChart3}
                                                color="blue"
                                            />
                                            <MetricCard
                                                title="Time Taken"
                                                value={algorithmState.lastSort.timeMs}
                                                unit="ms"
                                                icon={Clock}
                                                color="blue"
                                            />
                                        </div>
                                        <div className="mt-4 text-sm text-gray-300">
                                            Sorted by: <span className="text-cyan-400 font-medium">{algorithmState.lastSort.field}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Search Metrics */}
                                {algorithmState.lastSearch && (
                                    <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-xl p-6 border border-green-500/30">
                                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                            <SearchIcon className="w-5 h-5 text-green-400" />
                                            Binary Search Performance
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <MetricCard
                                                title="Comparisons"
                                                value={algorithmState.lastSearch.comparisons}
                                                unit="ops"
                                                icon={BarChart3}
                                                color="green"
                                            />
                                            <MetricCard
                                                title="Search Time"
                                                value={algorithmState.lastSearch.timeMs}
                                                unit="ms"
                                                icon={Clock}
                                                color="green"
                                            />
                                        </div>
                                        <div className="mt-4 space-y-2 text-sm">
                                            <div className="text-gray-300">
                                                Search term: <span className="text-green-400 font-medium">"{algorithmState.lastSearch.searchTerm}"</span>
                                            </div>
                                            <div className="text-gray-300">
                                                Search field: <span className="text-green-400 font-medium">{algorithmState.lastSearch.field}</span>
                                            </div>
                                            <div className="text-gray-300">
                                                Result: <span className={`font-medium ${algorithmState.lastSearch.found ? 'text-green-400' : 'text-red-400'}`}>
                          {algorithmState.lastSearch.found ? 'Found' : 'Not Found'}
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Full Data Table */}
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4">Current Dataset ({algorithmState.currentData.length} records)</h3>
                                <div className="bg-black/20 rounded-lg border border-purple-500/20 overflow-hidden">
                                    <div className="grid grid-cols-4 gap-4 p-4 border-b border-purple-500/20 bg-purple-800/30">
                                        <div className="font-semibold text-gray-300">Track ID</div>
                                        <div className="font-semibold text-gray-300">Title</div>
                                        <div className="font-semibold text-gray-300">Artist</div>
                                        <div className="font-semibold text-gray-300">Year</div>
                                    </div>
                                    {algorithmState.currentData.map((track, index) => (
                                        <div key={track.id} className={`grid grid-cols-4 gap-4 p-4 ${index % 2 === 0 ? 'bg-purple-900/20' : 'bg-purple-800/10'} hover:bg-purple-700/30 transition-colors`}>
                                            <div className="text-white font-medium">{track.id}</div>
                                            <div className="text-white">{track.name}</div>
                                            <div className="text-cyan-400">{track.artist}</div>
                                            <div className="text-gray-300">{track.year}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SongQuery;