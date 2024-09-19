import { useStore } from '../store/store'; // Ensure you import the correct store


export const getGirl = async (formData) => {
    const setGirl = useStore.getState().setGirl;

    try {
        const response = await fetch(`/api/girl`);
        if (response.ok) {
            const data = await response.json();
            setGirl(data);
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

export const likeGirlPost = async (formData) => {
    const updatePost = useStore.getState().updatePost;
    try {
        const response = await fetch('/api/post/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const updatedMessage = await response.json();
            updatePost(updatedMessage);
            return updatedMessage;
        } else {
            throw new Error('Failed to update');
        }
    } catch (error) {
        console.error('Error updating:', error);
        return null;
    }
};
