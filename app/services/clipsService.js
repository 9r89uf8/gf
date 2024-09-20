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