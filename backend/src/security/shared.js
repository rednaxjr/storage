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



module.exports = {
    detectMimeType,
}
