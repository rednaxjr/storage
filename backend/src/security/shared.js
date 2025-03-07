// utils/mimeUtils.js
function detectMimeType(mimeType) {
    const mimeCategories = {
        img: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        video: ['video/mp4', 'video/webm', 'video/ogg'],
        audio: ['audio/mpeg', 'audio/ogg', 'audio/wav'],
        pdf: ['application/pdf'],
        doc: ['application/msword', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        text: ['text/plain', 'text/html', 'text/css', 'application/json'],
    };

    for (const [category, types] of Object.entries(mimeCategories)) {
        if (types.includes(mimeType)) {
            return category;
        }
    }

    return 'unknown';
}

function formatSpeed(bytesPerSecond) {
    if (bytesPerSecond > 1024 * 1024) {
        return `${(bytesPerSecond / (1024 * 1024)).toFixed(2)} MB/s`;
    } else if (bytesPerSecond > 1024) {
        return `${(bytesPerSecond / 1024).toFixed(2)} KB/s`;
    }
    return `${Math.round(bytesPerSecond)} B/s`;
}

function formatRemainingTime(speed, remainingBytes) {
    if (speed === 0) return 'Calculating...';
    const seconds = remainingBytes / speed;
    if (seconds < 60) {
        return `${Math.round(seconds)}s`;
    }
    return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`;
}

module.exports = {
    detectMimeType,
    formatSpeed,
    formatRemainingTime
}
