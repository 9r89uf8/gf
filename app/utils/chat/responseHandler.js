// app/utils/chat/responseHandler.js
export const checkWordsInMessage = (message, wordList) => {
    const lowercaseMessage = message.toLowerCase();
    return wordList.some(word => lowercaseMessage.includes(word.toLowerCase()));
};

export const handleRefusedAnswer = (userData) => {
    const randomMessages = userData.premium ?
        { message: '😘', type: 'image' } :
        {
            messages: [
                '😘 para obtener fotos mias tiene que comprar premium.',
                'comprame premium para mandarte fotos mi amor. 😍',
                'no puedo mandarte fotos mi amor. tienes que comprar premium',
                'compra premium para ver mis fotos 😉',
            ],
            type: 'premium'
        };

    if (userData.premium) {
        return `${randomMessages.message}[IMAGEN: foto mia]`;
    }

    const randomIndex = Math.floor(Math.random() * randomMessages.messages.length);
    return `${randomMessages.messages[randomIndex]}[IMAGEN: foto mia]`;
};