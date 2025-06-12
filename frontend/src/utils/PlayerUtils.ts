export function formatMillis(millis: number) {
    const durationInSec: number = Math.floor(millis / 1000) ?? 0;
    const minutes: number = Math.floor(durationInSec / 60);
    const secs: number = durationInSec - minutes * 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}