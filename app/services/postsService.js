import { useStore } from '../store/store'; // Ensure you import the correct store


export const getPosts = async () => {
    const setPosts = useStore.getState().setPosts;

    try {
        const response = await fetch(`/api/posts`);
        if (response.ok) {
            const data = await response.json();
            setPosts(data);
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