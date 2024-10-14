import { useStore } from '../store/store'; // Ensure you import the correct store


export const getMembership = async (formData) => {
    const setMembership = useStore.getState().setMembership;

    try {
        const response = await fetch(`/api/membership`);
        if (response.ok) {
            const data = await response.json();
            setMembership(data);
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