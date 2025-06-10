import type {Song} from "../types/TrackProp.ts";

export class SearchAlgorithms {
    static binarySearch(arr: Song[], searchTerm: string | number, field: 'id' | 'name', metrics: { comparisons: number }): Song | null {
        // sort the array by the search field for binary search to work
        const sortedArr = [...arr].sort((a, b) => {
            if (typeof a[field] === 'string' && typeof b[field] === 'string') {
                return a[field].toLowerCase().localeCompare(b[field].toLowerCase());
            }
            return a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
        });

        let left = 0;
        let right = sortedArr.length - 1;

        while (left <= right) {
            metrics.comparisons++;
            const mid = Math.floor((left + right) / 2);
            const midValue = sortedArr[mid][field];

            let comparison = 0;
            if (typeof midValue === 'string' && typeof searchTerm === 'string') {
                comparison = midValue.toLowerCase().localeCompare(searchTerm.toLowerCase());
            } else if (typeof midValue === 'number' && typeof searchTerm === 'number') {
                comparison = midValue - searchTerm;
            } else {
                // Type mismatch, convert both to strings for comparison
                const midStr = String(midValue).toLowerCase();
                const searchStr = String(searchTerm).toLowerCase();
                comparison = midStr.localeCompare(searchStr);
            }

            if (comparison === 0) {
                return sortedArr[mid];
            } else if (comparison < 0) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return null;
    }
}