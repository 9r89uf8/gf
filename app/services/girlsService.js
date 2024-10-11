import { useStore } from '../store/store'; // Ensure you import the correct store


export const getGirls = async (formData) => {
    const setGirls = useStore.getState().setGirls;

    try {
        const response = await fetch(`/api/girls`);
        if (response.ok) {
            const data = await response.json();
            setGirls(data);
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