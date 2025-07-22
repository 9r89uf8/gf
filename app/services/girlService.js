import { useStore } from '../store/store'; // Ensure you import the correct store


export const getGirl = async (formData) => {
    const setGirl = useStore.getState().setGirl;
    const setLoadingGirl = useStore.getState().setLoadingGirl;

    try {
        const response = await fetch('/api/v2/girl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const data = await response.json();
            setGirl(data);
            setLoadingGirl(false);
            return data;
        } else {
            setLoadingGirl(false);
            console.log('errror')
            throw new Error('Failed to fetch the latest jornada');
        }
    } catch (error) {
        setLoadingGirl(false);
        console.error(error.message);
        return null;
    }
};
