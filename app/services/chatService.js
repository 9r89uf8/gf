import { useStore } from '../store/store'; // Ensure you import the correct store



export const fetchMessages = async (formData) => {
    const setConversationHistory = useStore.getState().setConversationHistory;
    const setMessageSent = useStore.getState().setMessageSent;

    try {
        setMessageSent(true)
        const response = await fetch(`/api/chat/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const data = await response.json();
            setConversationHistory(data);
            setMessageSent(false)
            return data;
        } else {
            setMessageSent(false)
            throw new Error('Failed to fetch the latest jornada');
        }
    } catch (error) {
        setMessageSent(false)
        console.error(error.message);
        return null;
    }
};


export const fetchAudios = async () => {
    const setAudios = useStore.getState().setAudios;

    try {
        const response = await fetch(`/api/audio`);
        if (response.ok) {
            const data = await response.json();
            setAudios(data);
            return data;
        } else {
            console.log('errror')
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
        const response = await fetch('/api/chat/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const updatedMessage = await response.json();
            updateMessage(updatedMessage);
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
    const setConversationHistory = useStore.getState().setConversationHistory;
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
            setConversationHistory(data.conversationHistory);
            setMessageSent(false);
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
        console.error('Error sending chat prompt:', error);
        return null;
    }
};
