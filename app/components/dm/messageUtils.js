// utils/messageUtils.js
export function convertFirestoreTimestampToDate(timestamp) {
    if (!timestamp) return null;
    if (timestamp._seconds !== undefined && timestamp._nanoseconds !== undefined) {
        return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6);
    }
    if (timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
        return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
    }
    return new Date(timestamp);
}

export function truncateWithEllipsis(text, maxLength) {
    return text && text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}