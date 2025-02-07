// app/utils/chat/responseHandler.js
export const checkWordsInMessage = (message, wordList) => {
    const lowercaseMessage = message.toLowerCase();
    return wordList.some(word => lowercaseMessage.includes(word.toLowerCase()));
};

export const handleRefusedAnswer = (userData) => {
    const messages = [
        "No manches, cambiemos de tema.",
        "Chale, ya estuvo.",
        "Bro, otra cosa, ¿va?",
        "Wee, mejor otro rollo.",
        "Oye, ya no jala esa onda.",
        "Nah, mejor hablemos de otra cosa."
    ];

    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
};
