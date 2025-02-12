import { useStore } from '../store/store'; // Ensure you import the correct store


export const getClips = async () => {
    const setAllClips = useStore.getState().setClips;
    try {
        const response = await fetch('/api/clips', {
            method: 'GET'
        });

        const data = await response.json();
        setAllClips(data)
        return data;

    } catch (error) {
        console.error('Error updating:', error);
        return null;
    }
};

export const getReels = async () => {
    const setReels = useStore.getState().setReels;

    try {
        const response = await fetch(`/api/reel/get`);
        if (response.ok) {
            const data = await response.json();
            setReels(data);
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

export const likeReel = async (formData) => {
    const updateReel = useStore.getState().updateReel;
    try {
        const response = await fetch('/api/reel/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const updatedMessage = await response.json();
            updateReel(updatedMessage);
            return updatedMessage;
        } else {
            throw new Error('Failed to update');
        }
    } catch (error) {
        console.error('Error updating:', error.message);
        return null;
    }
};