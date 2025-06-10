import type {Song} from "../types/TrackProp.ts";

export class SortingAlgorithms {
    // Helper function to properly compare values based on field type
    static compareValues(a: any, b: any, field: keyof Song): number {
        // For id and year fields, always compare as numbers
        if (field === 'id' || field === 'year') {
            const numA = Number(a);
            const numB = Number(b);
            return numA - numB;
        }

        // For string fields (name, artist), use string comparison
        return String(a).localeCompare(String(b));
    }

    static quickSort(arr: Song[], field: keyof Song, metrics: { swaps: number; comparisons: number }): Song[] {
        if (arr.length <= 1) return arr;

        const pivot = arr[Math.floor(arr.length / 2)];
        const left: Song[] = [];
        const right: Song[] = [];
        const equal: Song[] = [];

        for (let i = 0; i < arr.length; i++) {
            metrics.comparisons++;
            const comparison = this.compareValues(arr[i][field], pivot[field], field);

            if (comparison < 0) {
                left.push(arr[i]);
            } else if (comparison > 0) {
                right.push(arr[i]);
            } else {
                equal.push(arr[i]);
            }
        }

        metrics.swaps += left.length + right.length;

        return [
            ...this.quickSort(left, field, metrics),
            ...equal,
            ...this.quickSort(right, field, metrics)
        ];
    }

    static mergeSort(arr: Song[], field: keyof Song, metrics: { swaps: number; comparisons: number }): Song[] {
        if (arr.length <= 1) return arr;

        const mid = Math.floor(arr.length / 2);
        const left = this.mergeSort(arr.slice(0, mid), field, metrics);
        const right = this.mergeSort(arr.slice(mid), field, metrics);

        return this.merge(left, right, field, metrics);
    }

    static merge(left: Song[], right: Song[], field: keyof Song, metrics: { swaps: number; comparisons: number }): Song[] {
        const result: Song[] = [];
        let leftIndex = 0;
        let rightIndex = 0;

        while (leftIndex < left.length && rightIndex < right.length) {
            metrics.comparisons++;
            const comparison = this.compareValues(left[leftIndex][field], right[rightIndex][field], field);

            if (comparison <= 0) {
                result.push(left[leftIndex]);
                leftIndex++;
            } else {
                result.push(right[rightIndex]);
                rightIndex++;
            }
            metrics.swaps++;
        }

        while (leftIndex < left.length) {
            result.push(left[leftIndex]);
            leftIndex++;
            metrics.swaps++;
        }

        while (rightIndex < right.length) {
            result.push(right[rightIndex]);
            rightIndex++;
            metrics.swaps++;
        }

        return result;
    }
}