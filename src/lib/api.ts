import axios from 'axios';
import type {Song} from "../types/TrackProp.ts";

export interface ApiResponse extends Axios.AxiosXHR<Song[]> {
    data: Song[];
}


/**
 * Fetches song data from the API using axios.
 * This function is strongly-typed for better development experience and error prevention.
 *
 * @param {string} url - The API endpoint to fetch data from.
 * @returns {Promise<Song[]|null>} A promise that resolves to an array of Song objects, or null if an error occurs.
 */
export async function fetchApiData(url: string): Promise<Song[] | null> {
    try {
        const response: ApiResponse = await axios.get(url);
        return response.data.map((song: Song) => ({
            ...song,
            filePath: `/audio/${song.name.toLowerCase()}.mp3`
        }));
    } catch (error) {
        if (error instanceof Error) {
            console.error(`An unexpected error occurred: ${error.message}`);
        } else {
            console.error(error);
        }
        return null;
    }
}