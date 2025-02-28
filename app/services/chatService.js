// chatService.js
import { useStore } from '../store/store'; // Ensure you import the correct store



// export const fetchMessages = async (formData) => {
//     const setConversationHistory = useStore.getState().setConversationHistory;
//     const setMessageSent = useStore.getState().setMessageSent;
//
//     try {
//         setMessageSent(true)
//         const response = await fetch(`/api/chat/userDisplayMessages`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(formData),
//         });
//         if (response.ok) {
//             const data = await response.json();
//             setConversationHistory(data);
//             setMessageSent(false)
//             return data;
//         } else {
//             setMessageSent(false)
//             throw new Error('Failed to fetch the latest jornada');
//         }
//     } catch (error) {
//         setMessageSent(false)
//         console.error(error.message);
//         return null;
//     }
// };
//
//
// export const fetchAudios = async (formData) => {
//     const setAudios = useStore.getState().setAudios;
//     const audioFlag = useStore.getState().setAudioBoolean;
//
//     try {
//         const response = await fetch(`/api/audio`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(formData),
//         });
//         if (response.ok) {
//             audioFlag(false)
//             const data = await response.json();
//             setAudios(data);
//             return data;
//         } else {
//             audioFlag(false)
//             console.log('errror')
//             throw new Error('Failed to fetch audios');
//         }
//     } catch (error) {
//         audioFlag(false)
//         console.error(error.message);
//         return null;
//     }
// };

export const getMessagesTest = async (formData) => {
    const setConversationHistory = useStore.getState().setConversationHistory;

    try {
        const response = await fetch(`/api/chat/testing`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const data = await response.json();
            setConversationHistory(data);
            return data;
        } else {
            const data = await response.json();
            throw new Error('Failed to fetch the latest jornada');
        }
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

export const likeMessage = async (formData) => {
    const updateMessage = useStore.getState().updateMessage;
    try {
        const response = await fetch('/api/chat/likeMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const updatedMessage = await response.json();
            // updateMessage(updatedMessage);
            return updatedMessage;
        } else {
            throw new Error('Failed to update');
        }
    } catch (error) {
        console.error('Error updating:', error);
        return null;
    }
};


export const sendChatPrompt = async (formData) => {
    const addNotification = useStore.getState().addNotification;
    const setMessageSent = useStore.getState().setMessageSent;
    const updateUser = useStore.getState().updateUser;
    try {
        setMessageSent(true);
        const response = await fetch('/api/chat/prompt', {
            method: 'POST',
            body: formData, // Send formData directly
        });
        if (response.ok) {
            const data = await response.json();
            setMessageSent(false);
            updateUser({
                freeAudio: data.updatedUserData.freeAudio,
                freeMessages: data.updatedUserData.freeMessages
            })
            if(data.sendNotification){
                addNotification({
                    id: Date.now(),
                    type: 'success',
                    message: `a ${data.girlName} le gustó tu mensaje.`,
                });

            }
            return data.assistantMessage;
        } else {
            setMessageSent(false);
            throw new Error('Failed to send chat prompt');
        }
    } catch (error) {
        setMessageSent(false);
        console.error('Error sending chat prompt:', error.message);
        return null;
    }
};

export const saveUserMessage = async (formData) => {
    const setMessageSent = useStore.getState().setMessageSent;
    const updateUser = useStore.getState().updateUser;
    try {
        setMessageSent(true);
        const response = await fetch('/api/chat/saveUserMessage', {
            method: 'POST',
            body: formData, // Send formData directly
        });
        if (response.ok) {
            const data = await response.json();
            updateUser({
                freeAudio: data.updatedUserData.freeAudio,
                freeMessages: data.updatedUserData.freeMessages
            })
            return data.assistantMessage;
        } else {
            setMessageSent(false);
            throw new Error('Failed to send chat prompt');
        }
    } catch (error) {
        setMessageSent(false);
        console.error('Error sending chat prompt:', error.message);
        return null;
    }
};



export const responseFromLLM = async (formData) => {
    const addNotification = useStore.getState().addNotification;
    const setMessageSent = useStore.getState().setMessageSent;
    const updateUser = useStore.getState().updateUser;
    try {
        setMessageSent(true);
        const response = await fetch('/api/chat/responseFromLLM', {
            method: 'POST',
            body: formData, // Send formData directly
        });
        if (response.ok) {
            const data = await response.json();
            setMessageSent(false);
            updateUser({
                freeAudio: data.updatedUserData.freeAudio,
                freeMessages: data.updatedUserData.freeMessages
            });
            if(data.sendNotification){
                addNotification({
                    id: Date.now(),
                    type: 'success',
                    message: `a ${data.girlName} le gustó tu mensaje.`,
                });
            }
            return {
                success: true,
                assistantMessage: data.assistantMessage
            };
        } else {
            setMessageSent(false);
            return {
                success: false,
                error: 'Failed to send chat prompt'
            };
        }
    } catch (error) {
        setMessageSent(false);
        console.error('Error sending chat prompt:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
};


export const deleteMessages = async (formData) => {
    const deleteAll = useStore.getState().clearAll;

    try {
        const response = await fetch('/api/chat/deleteAllGirlMessages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const data = await response.json();
            deleteAll()
            return data;
        } else {
            throw new Error('Failed to fetch the latest jornada');
        }
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

export const getChatList = async () => {
    const chats = useStore.getState().setChats;

    try {
        const response = await fetch(`/api/chat/userChatList`, {
            method: 'GET'
        });
        if (response.ok) {
            const data = await response.json();
            chats(data)
            return data;
        } else {
            throw new Error('Failed to fetch the latest jornada');
        }
    } catch (error) {
        console.error(error.message);
        return null;
    }
};
