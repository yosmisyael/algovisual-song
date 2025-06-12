// Types and Interfaces
export interface Song {
    id: number;
    name: string;
    artist: string;
    year: number;
}

export interface SortMetrics {
    algorithm: 'quickSort' | 'mergeSort';
    field: 'id' | 'name' | 'artist' | 'year';
    swaps: number;
    comparisons: number;
    timeMs: number;
    resultData: Song[];
}

export interface SearchMetrics {
    algorithm: 'binarySearch';
    field: 'id' | 'name';
    searchTerm: string;
    comparisons: number;
    timeMs: number;
    resultData: Song | null;
    found: boolean;
}

export interface AlgorithmState {
    originalData: Song[];
    currentData: Song[];
    lastSort: SortMetrics | null;
    lastSearch: SearchMetrics | null;
    isLoading: boolean;
    error: string | null;
}

export interface SongQueryProps {
    querySize: number | 'all';
    onChangeQuerySize: (size: number | 'all') => void;
    searchTerm?: string | "";
    onSearch?: (term: string, field: 'id' | 'name') => void;
}